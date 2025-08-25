A test displaying a triangle in accordance to input.

Made with React and Vite.

To run:
cd react-app
npm install
npm run dev

<u>Answers to the questions</u>:

1. Initially I tried the Canvas approach, but the angles did not render correctly in some inputs, and inspecting the resulting page with the canvas HTML tag did not yield an easy way to debug the issue, and so I switched over to the SVG option, because I knew that SVG HTML tags are clearly separated and so are easier to use to debug the any input.


2. To calculate the angles, I first calculated the length of the sides of the Triangle.
    I did this by using Pythagoras: 
    d = sqrt((x1-x2)^2 + (y1-y2)^2)

    Then I used the law of cosines:
    cos(A) = (b² + c² - a²) / (2bc)

    And I calculated each angle accordingly.

3. The challenging part was the drawing of the triangle and especially the angles, as I had not dealt with
this particular problem in a web front-end context before.
Accurately displaying the angles required lurning about the "path" tags for SVG, and it was theoretically known
that if one knows the 3 points of a triangle and the point of the desired angle, the displaying of the angle can be calculated.
And so I created a function for that specific calculation, for the accurate display of the angles.

4. I did not deal with the transfer of the input from one page to another. I would've preferred to give the Display page the Triangle points data in a more React friendly way, like as an input to the DisplayPage function instead of using useLocation.

5. The tools I used were: Vite, Deepseek, Cursor
I used Vite to create a ready-made React and Typescript set-up.

    After reading the instructions' page carefully in Hebrew, Deepseek was used to quickly translate the instructions to English to better confirm what I had read and also to be ready to be used as a prompt to Cursor.
    Deepseek also helped with figuring out what native solutions there are for drawing geometric shapes. It offered two main options:
    HTML Canvas, and SVG.

    Cursor was used to create an initial React-based solution inside the Vite directory that was created. 