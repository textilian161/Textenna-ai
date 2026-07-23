# Textenna AI - Wearable & Textile Antenna Engineering Suite

Textenna AI is a modern, responsive, and high-fidelity web-based engineering tool designed specifically for Microwave & RF designers, garment engineers, and smart-clothing innovators. It simplifies and automates the initial physical sizing, substrate selection, and numerical simulation modeling of textile-based wearable antennas.

The application has been fully styled with a premium **Light Blue Tone theme** optimizing contrast, modern typography, and clean visual rhythm.

**Problem Statement**
Information for wearable textile antenna design is scattered across textbooks, research papers, simulation tutorials, and material datasheets. Textenna AI centralizes this information in one easy-to-use interface.
**Target Users**
•	Textile engineers
•	Electronics engineers
•	PhD researchers
•	University students
•	Wearable technology developers

**Live Deployment**
https://textenna-ai.vercel.app/



---

## 🚀 Major Features

Features outline
•	AI engineering assistant
•	Material information for textile substrates
•	Wearable antenna guidance
•	CST workflow overview
•	Interactive antenna visualization
•	Responsive React interface
•	Fast Vite-based application

Details

1. **Analytical RF Calculator Engine**:
   - Computes physical dimensions (radiator width $W$, length $L$, ground size $W_g \times L_g$) dynamically based on full-wave transmission line models.
   - Accounts for effective dielectric constant ($\epsilon_{reff}$) and fringing fields extension ($\Delta L$).

2. **Multi-Topology Support**:
   - **Microstrip Patch**: High-efficiency radiation, shielded ground plane backing, and extremely low SAR (Specific Absorption Rate) on human tissue.
   - **CPW-fed Monopole**: Compact, single-sided, high-bandwidth coplanar layout (unshielded).
   - **PIFA (Planar Inverted-F)**: Compact, low-profile, utilizes shorting walls for size-reduction.
   - **Symmetrical Dipole**: Simple, balanced, bi-directional, single-sided structure.

3. **High-Fidelity 2D & 3D Layer Stack-Up Visualizer**:
   - Renders top-view layout layouts (with dynamic mm annotations) using clean vector graphics.
   - Renders 3D layer stack-up schemas indicating top conductor sheets, flexible textile dielectrics, and back ground shields.

4. **Textile Physics Material Database**:
   - Interactive database of flexible substrates (Felt, Denim, Fleece, Cordura, Cotton) mapping their permittivity ($\epsilon_r$), loss tangent ($\tan \delta$), and standard thicknesses.
   - Conductive fabrics list (Shieldit Super, MedTex, Copper Foil, Conductive Thread mesh) with electrical conductivity ($\sigma$) and sheet resistance values.

5. **CST Studio Suite VBA Macro Generator**:
   - Generates fully automated, synthesizable VBA macro scripts.
   - Copy-paste directly into CST Studio Suite to instantly model the exact 3D brick layout, waveguide/discrete ports, boundaries, and transient solver settings.

6. **Interactive Textenna RF Chat Assistant**:
   - AI-powered consultant to troubleshoot detuning, physical bending/crumpling, impedance mismatches, and Specific Absorption Rate (SAR) limits near human tissue.
   - **AI Feature**
The application includes an AI assistant that answers wearable antenna questions.
**Example System Prompt**
You are Textenna AI, an expert assistant for wearable textile antennas. Help engineers understand textile materials, antenna fundamentals, CST workflow, and practical design decisions. Provide accurate, educational, step-by-step explanations. If uncertain, say so rather than inventing information.


---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18+ with Vite
- **Programming Language**: TypeScript (with full type-safety)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Premium Light Blue / Sky Slate palette (highly legible and eye-strain reduction)

---

## 🖥️ Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build**:
   ```bash
   npm run build
   ```
   Generates static production assets in the `dist/` directory.

---

## 📐 Textile RF Physics Guidelines Reference

- **Permittivity Optimization**: Materials like Felt and Fleece offer $\epsilon_r \approx 1.2 - 1.45$. This is extremely close to air, leading to larger physical radiator sizes but excellent radiation efficiency (>85%) and wider bandwidths.
- **On-Body Detuning**: Unshielded structures (monopoles, dipoles) degrade rapidly when placed near human skin ($\epsilon_r \approx 50$ for muscle/tissue at $2.4\text{ GHz}$). Textenna AI recommends utilizing solid ground planes (such as Microstrip Patches or PIFAs) to block back-radiation and limit SAR to safe IEEE levels.
- **Bending & Wetness**: Physical bending reduces the physical length, causing a frequency shift upwards. Water absorption (sweat) dramatically increases dielectric losses, lowering antenna gain.

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### AI Assistant
![AI Assistant](screenshots/AI chat.png)

### Details

![Details](screenshots/details.png)

- **Technology Used**
-	React
-	TypeScript
-	Vite
-	Node.js
-	Express
-	Google AI Studio
-	Google GenAI SDK
-	Git
-	GitHub
-	Vercel
-	Visual Studio Code

**Project Structure**
src/
assets/
server.ts
package.json
vite.config.ts
README.md

**Lessons Learned**
This project improved skills in AI-assisted frontend development, React, Git/GitHub, deployment with Vercel, and creating engineering-focused user interfaces.

**Author**
Muntaha Rafiq developed this app as an individual academic project.


---

***Textenna AI — Empowering the next generation of smart garments and body area networks (BAN).***
