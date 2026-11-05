/*
  EDIT THIS FILE to update the portfolio. No HTML knowledge required.
  - Edit the About text, contact links, and project descriptions below.
  - Set visible: false to remove a project from the website without deleting it.
  - Set visible: true when you're ready to display it.
  - Add another project by copying the example at the bottom.
  - Changes become public only when you commit them to your published branch.
*/
window.PORTFOLIO = {
  name: "Neal Dongre",
  about:
    "Results-oriented, creative in-house lawyer with over 20 years of combined legal, business, and leadership experience. Seeking opportunities to deploy deep legal experience combined with technology training and skill set to redefine the legal industry.",
  github: "https://github.com/nealdongre-code",
  linkedin: "", // Add your full LinkedIn profile URL if you'd like it displayed.
  email: "",    // Add a public contact email if you'd like it displayed.
  projects: [
    {
      title: "Litigation Hold Manager",
      category: "Legal operations / Workflow software",
      description:
        "An interactive tool for organizing litigation holds, tracking preservation steps, and simplifying recurring legal workflows. The public demonstration uses fictional data.",
      repo: "https://github.com/nealdongre-code/Litigation-Hold-Manager",
      demo: "https://nealdongre-code.github.io/Litigation-Hold-Manager/",
      tags: ["Legal tech", "Workflow", "Web app"],
      visible: true,
      featured: true
    },
    {
      title: "SEC Material Contracts Trends Dashboard",
      category: "SEC disclosures / Contract research",
      description:
        "An interactive research dashboard exploring 114 Exhibit 10 attachments from 19 issuers across 2021, 2023, and 2025. Filter the sample by industry, year, filing type, and contract category, with AI-assisted classifications and links to original SEC filings. Educational and research use only; classifications are provisional.",
      repo: "https://github.com/nealdongre-code/sec-disclosure-trend-analyzer",
      demo: "https://nealdongre-code.github.io/sec-disclosure-trend-analyzer/",
      tags: ["Legal tech", "AI-assisted research", "Data visualization"],
      visible: true,
      featured: false
    }
    // ADD ANOTHER PROJECT (remove the // marks and separate entries with a comma):
    // ,{
    //   title: "Another Project",
    //   category: "Automation / Research",
    //   description: "One or two sentences explaining the project and why it matters.",
    //   repo: "https://github.com/nealdongre-code/your-repo",
    //   demo: "", // optional
    //   tags: ["Automation", "AI"],
    //   visible: false,
    //   featured: false
    // }
  ]
};
