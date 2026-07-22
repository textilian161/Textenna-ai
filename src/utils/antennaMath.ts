import { AntennaDimensions, AntennaTypeId } from "../types";

export function calculateAntennaDimensions(
  type: AntennaTypeId,
  freqGhz: number,
  epsilonR: number,
  thicknessMm: number
): AntennaDimensions {
  const c = 299792458; // m/s
  const cMmGhz = 300; // c in (mm * GHz)
  
  if (type === "patch") {
    // 1. Width of the patch
    const width = cMmGhz / (2 * freqGhz) * Math.sqrt(2 / (epsilonR + 1));
    
    // 2. Effective dielectric constant
    const hOverW = thicknessMm / width;
    const effectiveEpsilon = (epsilonR + 1) / 2 + ((epsilonR - 1) / 2) * Math.pow(1 + 12 * hOverW, -0.5);
    
    // 3. Extension of length delta L
    const wOverH = width / thicknessMm;
    const term1 = (effectiveEpsilon + 0.3) * (wOverH + 0.264);
    const term2 = (effectiveEpsilon - 0.258) * (wOverH + 0.8);
    const deltaL = 0.412 * thicknessMm * (term1 / term2);
    
    // 4. Actual physical length of patch
    const totalLength = cMmGhz / (2 * freqGhz * Math.sqrt(effectiveEpsilon));
    const length = totalLength - 2 * deltaL;
    
    // 5. Ground plane dimensions (minimum margin standard: patch + 12*h)
    const margin = Math.max(10, 6 * thicknessMm);
    const groundWidth = width + 2 * margin;
    const groundLength = length + 2 * margin;
    
    // 6. Microstrip feedline width (standard 50 Ohm line approximation on textile)
    // Simplified feedline width calculation for ~50 Ohms
    let feedlineWidth = 3.0; // default safe fallback
    if (epsilonR > 1) {
      // Approximation for w/h of a 50 Ohm microstrip line
      const A = (50 / 60) * Math.sqrt((epsilonR + 1) / 2) + ((epsilonR - 1) / (epsilonR + 1)) * (0.23 + 0.11 / epsilonR);
      const wOverH50 = (8 * Math.exp(A)) / (Math.exp(2 * A) - 2);
      feedlineWidth = Math.max(1.0, Math.min(10.0, wOverH50 * thicknessMm));
    }
    const feedlineLength = margin;

    return {
      width: parseFloat(width.toFixed(2)),
      length: parseFloat(length.toFixed(2)),
      effectiveEpsilon: parseFloat(effectiveEpsilon.toFixed(3)),
      deltaL: parseFloat(deltaL.toFixed(2)),
      groundWidth: parseFloat(groundWidth.toFixed(2)),
      groundLength: parseFloat(groundLength.toFixed(2)),
      feedlineWidth: parseFloat(feedlineWidth.toFixed(2)),
      feedlineLength: parseFloat(feedlineLength.toFixed(2)),
      resonantFreq: freqGhz
    };
  } else if (type === "cpw_monopole") {
    // CPW has radiator and ground on same plane, epsilon_eff ~ (epsilon_r + 1) / 2
    const effectiveEpsilon = (epsilonR + 1) / 2;
    
    // Resonant length of quarter-wavelength monopole
    const length = cMmGhz / (4 * freqGhz * Math.sqrt(effectiveEpsilon));
    
    // Radiator width (approx 60% of length for moderate bandwidth)
    const width = length * 0.6;
    
    // Feedline width & gap (standard 50 Ohm CPW on fabric: w=3mm, gap=0.5mm is common)
    const feedlineWidth = 3.0;
    const gap = 0.5;
    
    // Ground planes are on each side of the feedline
    const groundWidth = width * 1.8;
    const groundLength = length * 0.4; // back ground is short
    const feedlineLength = groundLength + 3.0;

    return {
      width: parseFloat(width.toFixed(2)),
      length: parseFloat(length.toFixed(2)),
      effectiveEpsilon: parseFloat(effectiveEpsilon.toFixed(3)),
      groundWidth: parseFloat(groundWidth.toFixed(2)),
      groundLength: parseFloat(groundLength.toFixed(2)),
      feedlineWidth,
      feedlineLength: parseFloat(feedlineLength.toFixed(2)),
      gap,
      resonantFreq: freqGhz
    };
  } else if (type === "pifa") {
    // PIFA length + width ~ lambda / 4 in medium
    const lambdaFour = cMmGhz / (4 * freqGhz * Math.sqrt(epsilonR));
    const length = lambdaFour * 0.6;
    const width = lambdaFour * 0.4;
    
    const groundWidth = width * 2.5;
    const groundLength = length * 2.0;
    
    const feedlineWidth = 2.0;
    const feedlineLength = thicknessMm; // vertical or offset feed

    return {
      width: parseFloat(width.toFixed(2)),
      length: parseFloat(length.toFixed(2)),
      effectiveEpsilon: epsilonR, // fully over ground
      groundWidth: parseFloat(groundWidth.toFixed(2)),
      groundLength: parseFloat(groundLength.toFixed(2)),
      feedlineWidth,
      feedlineLength,
      resonantFreq: freqGhz
    };
  } else {
    // dipole
    const effectiveEpsilon = (epsilonR + 1) / 2; // on single sheet
    const halfLambda = cMmGhz / (2 * freqGhz * Math.sqrt(effectiveEpsilon));
    
    const totalLength = halfLambda * 0.96; // trimming factor
    const length = totalLength / 2; // single arm length
    const width = 2.5; // dipole arm width
    
    return {
      width,
      length: parseFloat(length.toFixed(2)), // arm length
      effectiveEpsilon: parseFloat(effectiveEpsilon.toFixed(3)),
      groundWidth: 0, // no ground plane
      groundLength: 0,
      feedlineWidth: 1.5,
      feedlineLength: 4.0, // feed gap
      resonantFreq: freqGhz
    };
  }
}

// Generate the CST VBA Macro code to automate antenna creation!
export function generateCSTMacro(
  type: AntennaTypeId,
  dim: AntennaDimensions,
  subName: string,
  subEpsilon: number,
  subThickness: number,
  condName: string
): string {
  const dateStr = new Date().toLocaleDateString();
  let macro = `' CST VBA Macro generated by WearLink AI on ${dateStr}
' Antenna: ${type.toUpperCase()}
' Substrate: ${subName} (Eps = ${subEpsilon}, Thickness = ${subThickness} mm)
' Conductive: ${condName}

Sub Main ()
    ' Define Units
    Units.Geometry "mm"
    Units.Frequency "GHz"
    Units.Time "ns"

    ' Store Dimensions in History List
    StoreDoubleParameter "Freq", ${dim.resonantFreq}
    StoreDoubleParameter "W", ${dim.width}
    StoreDoubleParameter "L", ${dim.length}
    StoreDoubleParameter "H_sub", ${subThickness}
    StoreDoubleParameter "T_cond", 0.05
`;

  if (type === "patch") {
    macro += `    StoreDoubleParameter "W_g", ${dim.groundWidth}
    StoreDoubleParameter "L_g", ${dim.groundLength}
    StoreDoubleParameter "W_f", ${dim.feedlineWidth}
    StoreDoubleParameter "L_f", ${dim.feedlineLength}

    ' 1. Create Ground Plane
    With Brick
        .Reset
        .Name "ground"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_g/2", "W_g/2"
        .Yrange "-L_g/2", "L_g/2"
        .Zrange "0", "T_cond"
        .Create
    End With

    ' 2. Create Textile Substrate
    With Brick
        .Reset
        .Name "substrate"
        .Component "component1"
        .Material "${subName}"
        .Xrange "-W_g/2", "W_g/2"
        .Yrange "-L_g/2", "L_g/2"
        .Zrange "T_cond", "T_cond + H_sub"
        .Create
    End With

    ' 3. Create Microstrip Patch
    With Brick
        .Reset
        .Name "patch"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W/2", "W/2"
        .Yrange "-L/2", "L/2"
        .Zrange "T_cond + H_sub", "T_cond + H_sub + T_cond"
        .Create
    End With

    ' 4. Create Microstrip Feedline
    With Brick
        .Reset
        .Name "feedline"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_f/2", "W_f/2"
        .Yrange "-L_g/2", "-L/2"
        .Zrange "T_cond + H_sub", "T_cond + H_sub + T_cond"
        .Create
    End With

    ' 5. Boolean Union patch and feedline
    Solid.Add "component1:patch", "component1:feedline"
`;
  } else if (type === "cpw_monopole") {
    macro += `    StoreDoubleParameter "W_g", ${dim.groundWidth}
    StoreDoubleParameter "L_g", ${dim.groundLength}
    StoreDoubleParameter "W_f", ${dim.feedlineWidth}
    StoreDoubleParameter "L_f", ${dim.feedlineLength}
    StoreDoubleParameter "gap", ${dim.gap || 0.5}

    ' 1. Create Textile Substrate
    With Brick
        .Reset
        .Name "substrate"
        .Component "component1"
        .Material "${subName}"
        .Xrange "-W_g/2", "W_g/2"
        .Yrange "-L_f", "L"
        .Zrange "0", "H_sub"
        .Create
    End With

    ' 2. Create Monopole Radiator (on top layer)
    With Brick
        .Reset
        .Name "radiator"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W/2", "W/2"
        .Yrange "0", "L"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With

    ' 3. Create CPW Feedline (on top layer)
    With Brick
        .Reset
        .Name "feed"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_f/2", "W_f/2"
        .Yrange "-L_f", "0"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With
    Solid.Add "component1:radiator", "component1:feed"

    ' 4. Create Left CPW Ground Plane
    With Brick
        .Reset
        .Name "gnd_left"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_g/2", "-W_f/2 - gap"
        .Yrange "-L_f", "-L_f + L_g"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With

    ' 5. Create Right CPW Ground Plane
    With Brick
        .Reset
        .Name "gnd_right"
        .Component "component1"
        .Material "${condName}"
        .Xrange "W_f/2 + gap", "W_g/2"
        .Yrange "-L_f", "-L_f + L_g"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With
`;
  } else if (type === "pifa") {
    macro += `    StoreDoubleParameter "W_g", ${dim.groundWidth}
    StoreDoubleParameter "L_g", ${dim.groundLength}

    ' 1. Create Ground Plane
    With Brick
        .Reset
        .Name "ground"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_g/2", "W_g/2"
        .Yrange "-L_g/2", "L_g/2"
        .Zrange "0", "T_cond"
        .Create
    End With

    ' 2. Create Textile Substrate
    With Brick
        .Reset
        .Name "substrate"
        .Component "component1"
        .Material "${subName}"
        .Xrange "-W_g/2", "W_g/2"
        .Yrange "-L_g/2", "L_g/2"
        .Zrange "T_cond", "T_cond + H_sub"
        .Create
    End With

    ' 3. Create PIFA Patch
    With Brick
        .Reset
        .Name "patch"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_g/2", "-W_g/2 + W"
        .Yrange "-L_g/2", "-L_g/2 + L"
        .Zrange "T_cond + H_sub", "T_cond + H_sub + T_cond"
        .Create
    End With

    ' 4. Create Shorting Plate (Wall at the left edge)
    With Brick
        .Reset
        .Name "shorting_wall"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-W_g/2", "-W_g/2 + 0.5"
        .Yrange "-L_g/2", "-L_g/2 + L"
        .Zrange "T_cond", "T_cond + H_sub"
        .Create
    End With
`;
  } else {
    // dipole
    macro += `    ' 1. Create Textile Substrate
    With Brick
        .Reset
        .Name "substrate"
        .Component "component1"
        .Material "${subName}"
        .Xrange "-L*1.2", "L*1.2"
        .Yrange "-W*4", "W*4"
        .Zrange "0", "H_sub"
        .Create
    End With

    ' 2. Create Left Dipole Arm
    With Brick
        .Reset
        .Name "arm_left"
        .Component "component1"
        .Material "${condName}"
        .Xrange "-L - 0.5", "-0.5"
        .Yrange "-W/2", "W/2"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With

    ' 3. Create Right Dipole Arm
    With Brick
        .Reset
        .Name "arm_right"
        .Component "component1"
        .Material "${condName}"
        .Xrange "0.5", "L + 0.5"
        .Yrange "-W/2", "W/2"
        .Zrange "H_sub", "H_sub + T_cond"
        .Create
    End With
`;
  }

  macro += `
    ' Print Confirmation
    ReportInformationToWindow "WearLink AI: Macro generated successfully."
End Sub`;

  return macro;
}
