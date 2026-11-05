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
