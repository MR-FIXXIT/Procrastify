<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# NOTNOW

## Basic Details

### Team Name: Pookatte Kavadi

### Team Members

  - Team Lead: Naveen P J - Department of Computer Science
  - Member 2: Mohammed Rizvan - Department of Computer Science

### Project Description

The Ultimate Procrastinator is a Chrome Extension designed to help users achieve their procrastination goals, one distraction at a time. It identifies unproductive websites and, instead of blocking them, redirects users to a curated list of "procrastination videos" to fully embrace their procrastination.

### The Problem (that doesn't exist)

People are spending way too much time being productive. Deadlines are being met, projects are being completed, and inboxes are getting cleared. **This is unacceptable.**
Our extension solves the urgent, overlooked problem of over-productivity by ensuring users get frequent, unavoidable breaks to engage in the noble art of procrastination.


### The Solution (that nobody asked for)

Our solution is a revolutionary Chrome extension that doesn't fight procrastination but *facilitates* it\! By intelligently identifying when you're about to be productive, it strategically diverts you to a hand-picked selection of engaging (and utterly useless for productivity) videos, ensuring your procrastination is both efficient and delightful. Why resist the urge when you can perfect it?

-----

## Technical Details

### Technologies/Components Used

For Software:

  - **Languages used**: JavaScript, HTML, CSS
  - **Frameworks/Libraries**: None explicitly stated, but utilizes **Chrome Extension APIs** for tab management, storage, and messaging.
  - **Tools used**: **Groq API** for URL classification and message generation.

For Hardware:

  - No hardware components are required for this software-only project.

### Implementation

For Software:

# Installation

1.  **Download/Clone** this repository.
2.  Open **Google Chrome**.
3.  Navigate to `chrome://extensions`.
4.  Enable **Developer mode** (toggle switch in the top right).
5.  Click on **"Load unpacked"**.
6.  Select the project directory containing the `manifest.json` file.
7.  The extension "The Ultimate Procrastinator" should now appear in your extensions list.

# Run

The extension runs automatically in the background once installed.

  * It periodically checks the active tab's URL.
  * If the URL is classified as "unproductive" (or not in a hardcoded productive/unproductive list), it uses the Groq API to classify the URL.
  * If identified as a procrastination site, a modal popup will appear with a procrastination message and a link to a random procrastination video.
  

-----

### Project Documentation

For Software:

# Screenshots (Add at least 3)

![Screenshot of a "procrastination" popup on GeeksforGeeks](Screenshot(41).png)
*This screenshot shows the extension suggesting a break to "binge-watch cat videos and contemplate the meaning of life" while on a GeeksforGeeks page.*

![Screenshot of another "procrastination" popup on GeeksforGeeks](Screenshot(39).png)
*This screenshot displays a different procrastination message, stating "today's clearly 'research day'!" on the same GeeksforGeeks page but the message is relating to the content in the webpage*

![Screenshot of a "procrastination" popup on LeetCode](Screenshot(40).png)
*This screenshot illustrates the extension advising "who needs to solve a pangram problem when you can watch cat videos instead?" on a LeetCode problem page.*

# Diagrams

\![Workflow](Add your workflow/architecture diagram here)
*Add caption explaining your workflow*

For Hardware:

# Schematic & Circuit

\![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

\![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

# Build Photos

\![Components](Add photo of your components here)
*List out all components shown*

\![Build](Add photos of build process here)
*Explain the build steps*

\![Final](Add photo of final product here)
*Explain the final build*

-----

### Project Demo

# Video

[Add your demo video link here]
*Explain what the video demonstrates*

# Additional Demos

[Add any extra demo materials/links]

-----

## Team Contributions

  - Naveen P J: Worked on building extension and implementing groq
  - Mohammed Rizvan: Worked on building extension and testing

-----

Made with ❤️ at TinkerHub Useless Projects
