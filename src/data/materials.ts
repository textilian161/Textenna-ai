import { Substrate, ConductiveMaterial, AntennaType } from "../types";

export const SUBSTRATES: Substrate[] = [
  {
    id: "felt",
    name: "Wool Felt",
    epsilonR: 1.44,
    tanDelta: 0.016,
    thickness: 2.0,
    description: "Highly popular in textile antennas. It is thick and porous, providing a low dielectric constant close to air, which increases antenna bandwidth and radiation efficiency. Easy to hand-cut."
  },
  {
    id: "denim",
    name: "Denim Fabric",
    epsilonR: 1.70,
    tanDelta: 0.025,
    thickness: 1.2,
    description: "Robust, heavy fabric commonly used in jackets and jeans. It has moderate loss tangent and is suitable for practical everyday wearables, though multiple layers might be stacked for increased thickness."
  },
  {
    id: "fleece",
    name: "Polyester Fleece",
    epsilonR: 1.25,
    tanDelta: 0.004,
    thickness: 3.0,
    description: "Extremely low dielectric constant and very low loss tangent. Fleece provides exceptional radiation efficiency and wide bandwidth due to its air-filled volume. Ideal for cold-weather smart apparel."
  },
  {
    id: "cotton",
    name: "100% Cotton (Woven)",
    epsilonR: 1.60,
    tanDelta: 0.040,
    thickness: 0.8,
    description: "Soft and breathable. It exhibits higher loss tangent, particularly under high humidity or perspiration conditions, due to its hydrophilic nature. Best for lightweight body-worn prototypes."
  },
  {
    id: "polyester_woven",
    name: "Woven Polyester",
    epsilonR: 1.90,
    tanDelta: 0.015,
    thickness: 0.5,
    description: "Hydrophobic synthetic fabric, meaning it absorbs very little moisture. Provides consistent RF performance across different humidity levels. Thin profile, requiring stacks for patch antennas."
  },
  {
    id: "silk",
    name: "Natural Silk",
    epsilonR: 1.75,
    tanDelta: 0.012,
    thickness: 0.3,
    description: "Smooth, strong, and highly flexible natural fiber. Excellent for ultra-thin conformal antennas embedded inside lightweight, premium garments."
  },
  {
    id: "fr4_reference",
    name: "FR4 (Rigid Reference)",
    epsilonR: 4.40,
    tanDelta: 0.020,
    thickness: 1.6,
    description: "Standard rigid epoxy-glass substrate included as a technical reference. Considerably heavier, rigid, and has a much higher dielectric constant, resulting in more compact but less flexible antennas."
  }
];

export const CONDUCTIVE_MATERIALS: ConductiveMaterial[] = [
  {
    id: "shieldit",
    name: "Shieldit Super Fabric",
    conductivity: 250000,
    sheetResistance: 0.05,
    description: "Woven nylon fabric plated with nickel and copper, backed with a hot-melt adhesive. Can be ironed directly onto textiles. Excellent conductivity, durable, and the gold standard for textile antenna prototyping."
  },
  {
    id: "noradell",
    name: "Nora Dell Fabric",
    conductivity: 1000000,
    sheetResistance: 0.01,
    description: "Premium nickel/copper/silver coated non-woven textile. Provides extremely high conductivity and superb corrosion resistance. Highly flexible and comfortable."
  },
  {
    id: "silver_thread",
    name: "Silver Conductive Thread",
    conductivity: 50000,
    sheetResistance: 4.0, // effective sheet resistance when embroidered densely
    description: "Excellent for machine or hand embroidery. Allows direct integration of the antenna pattern into the garment fabric. High resistance requires thick multi-thread stitching paths to avoid ohmic loss."
  },
  {
    id: "copper_tape",
    name: "Copper Foil Tape",
    conductivity: 58000000,
    sheetResistance: 0.001,
    description: "Standard pure copper adhesive tape. Offers the highest possible electrical efficiency, but suffers from rigidity, creases, and cracking after moderate mechanical bending. Best for initial workbench testing."
  },
  {
    id: "conductive_ink",
    name: "Printed Silver Ink",
    conductivity: 150000,
    sheetResistance: 0.15,
    description: "Flexible conductive polymer ink printed using screen-printing or inkjet. Highly suitable for mass manufacturing directly on apparel, though sensitive to micro-cracks under severe stretching."
  }
];

export const ANTENNA_TYPES: AntennaType[] = [
  {
    id: "patch",
    name: "Microstrip Patch Antenna",
    description: "A rectangular conductive radiating element printed over a larger ground plane, separated by a textile substrate layer.",
    advantages: [
      "Excellent isolation from human body tissue due to continuous solid back ground plane.",
      "Extremely low SAR (Specific Absorption Rate) values on the human skin side.",
      "High forward gain pointing away from the body, improving range.",
      "Easy to fabricate using iron-on conductive fabrics like Shieldit."
    ],
    disadvantages: [
      "Narrow bandwidth (typically 2% to 5%) due to thin substrates.",
      "Relatively large physical size at lower frequencies (e.g. 868 MHz).",
      "Requires two separate conductor layers and precise alignment."
    ],
    typicalSAR: "Low (Shielded)",
    bodyEffect: "Very minimal frequency detuning or radiation degradation, because the bottom ground plane serves as an electromagnetic shield.",
    radiationPattern: "Directional (Broadside/Hemispherical, pointing away from the ground plane)"
  },
  {
    id: "cpw_monopole",
    name: "CPW-Fed Monopole Antenna",
    description: "A planar monopole antenna where both the radiator and the coplanar coplanar ground planes are placed on the same top face of the substrate.",
    advantages: [
      "Single-layer fabrication (no alignment or vias required).",
      "Wide impedance bandwidth (often >50%, excellent for UWB or multi-band).",
      "Less sensitive to substrate thickness variations.",
      "Highly flexible and easy to embed in single layers of clothing."
    ],
    disadvantages: [
      "No shielding on the back; highly sensitive to body tissue presence.",
      "Detunes significantly when placed directly against skin.",
      "High SAR rating as half the radiation penetrates directly into the body."
    ],
    typicalSAR: "High (Omnidirectional)",
    bodyEffect: "High body detuning. The high permittivity of the human body (epsilon_r ~ 40 to 50 at microwave bands) pulls the resonant frequency down significantly and absorbs up to 50% of the radiated power.",
    radiationPattern: "Omnidirectional (Donut-shaped, similar to standard dipole)"
  },
  {
    id: "pifa",
    name: "Planar Inverted-F Antenna (PIFA)",
    description: "A patch antenna with a shorting wall or shorting pin connecting the patch to the ground plane, creating a quarter-wave resonance.",
    advantages: [
      "Ultra-compact footprint (approximately half the size of a conventional patch).",
      "Good body isolation provided by the partial or full bottom ground plane.",
      "Low SAR compared to omnidirectional antennas.",
      "Relatively high gain for its compact size."
    ],
    disadvantages: [
      "Requires a vertical shorting path (shorting wall/pin), which can be mechanically challenging to fabricate in textiles.",
      "Narrow bandwidth compared to CPW or dipole configurations."
    ],
    typicalSAR: "Very Low (Double Shielded)",
    bodyEffect: "Minimal. The ground plane shields the body from the high field regions, although bending of the shorting wall can cause slight impedance shifts.",
    radiationPattern: "Semi-directional (Slightly tilted beam pointing away from ground)"
  },
  {
    id: "dipole",
    name: "Textile Half-Wave Dipole",
    description: "A classic two-arm symmetrical linear antenna fed in the center, placed on a single layer of fabric.",
    advantages: [
      "Classic, simple, and well-understood structure.",
      "Very easy to embroider with conductive silver threads.",
      "Provides reliable bi-directional communication in free space."
    ],
    disadvantages: [
      "Extreme sensitivity to human body proximity.",
      "Radiation efficiency drops to single digits when placed directly on skin due to dry tissue dissipation.",
      "Omnidirectional radiation leads to high SAR."
    ],
    typicalSAR: "High (Omnidirectional)",
    bodyEffect: "Severe. The antenna suffers from massive impedance mismatch and extreme power absorption when placed close to the body. Requires a spacing layer of at least 15-20mm for reasonable performance.",
    radiationPattern: "Bidirectional (Omnidirectional in the H-plane)"
  }
];
