# Marvel Character Compare


Pull info from Marvel API and display characteristics / media of selected character.
Drag and drop Character cards into a staging area to see common histories of those two characters, ie battles they've been in together, common major events.


User story and how to meet project requirements:

https://trello.com/b/Ux3ZNosS/project-1


Wireframe:

https://github.com/victormrecabarren/Project1/blob/master/wireframe%20rough.png


Technologies used:

HTML

CSS

Javascript

jQuery Library

AJAX

JSON

Marvel API

-----------------

Approach:

My approach was to create a board that could fill with cards. These cards would have information delivered from the API. The user would input a marvel character, and a call would be made to the API for data for that character. AJAX retrieved the information, then using the jQuery library, the JSON could be translated into an object. The values stored in the object would comprise the contents of the card.

Once several cards are on the screen, a "stage" would appear just above the form, transparent divs with white borders that were the exact size of the cards. This implies to the user that cards belong there.

Using the drag and drop interface module I built using jQuery event listeners, the stage would glow using CSS class transition, to further indicate to the user to take cards to the dropzone.

Once two cards are in the staging area, the cards create space between them using CSS transition. A delay is set for a div to fill the space created between the cards. This div would be populated with a list of events.
These events are events held in common by both characters.
The API gives information about each characters events, a function is used to compare the events of both characters and create an unordered list of only the events that appear for both characters. This lets the user "compare" the characters' event lists.


//////

Remaining issues:

- The API is very limited. I would have liked more images for each character but the API only provides one. I initially intended to give the cards a flip functionality. On the "back" of the card, there would be a carousel of images of the character /videos of the character in action.

- The API is also very slow. The page will throw an error if the user attempts to compare the characters too quickly, as the second AJAX call for the character's event list has not returned data yet.

- The page does not adjust to different screen sizes too well, this can/should be changed in an update.
