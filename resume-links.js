window.RESUME_LINKS = {
  // Change this single value when you want the homepage "Download Resume"
  // button to point at a different hosted resume route on hritikm.com.
  activeButtonPath: "/pm-resume",
  // activeButtonPath: "/resume",

  routes: {
    resume: {
      label: "Generalist Resume",
      targetUrl: "https://tinyurl.com/Hritik-CV1"
    },
    "pm-resume": {
      label: "PM Resume",
      targetUrl: "https://drive.google.com/file/d/1V99PVRPyS3ZBqxBicX3mJQsmxRAyPSm9/view"
    }
  }
};

// Previous direct resume link before domain-based routing:
// const PREVIOUS_DIRECT_RESUME_URL = "https://tinyurl.com/Hritik-CV1";
