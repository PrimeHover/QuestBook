# PH_QuestBook.js
Quest Book for RPG Maker MV  
*created by PrimeHover*

### Installation
* Download the JS file and include it into the ```/plugins``` folder of your project.
* Open the Plugin Manager, select the file **PH_QuestBook.js**, and turn it on.

### Parameters
* ``Show in Menu``:  Show the Quest Book on the menu (0: no, 1: yes).
* ``Name in Menu``: Label of the Quest Book on the menu.
* ``Display Type``: Change the position for displaying the quest book (0: top view, 1: side view).
* ``Show Icons``: Show an icon before the name of the quest in the book (1: yes, 0: no).
* ``Background Image``: Image for background of the quest book (PNG image only; Leave it in blank to have the default background)
* ``Icon Primary Quest``: ID of the icon to be displayed in case the quest is primary.
* ``Icon Secondary Quest``: ID of the icon to be displayed in case the quest is secondary.
* ``Icon Completed Quest``: ID of the icon to be displayed in case the quest is completed.
* ``Icon Failed Quest``: ID of the icon to be displayed in case the quest is failed.
* ``Text Primary``: Vocabulary for "Primary".
* ``Text Secondary``: Vocabulary for "Secondary".
* ``Text Complete``: Vocabulary for "Complete".
* ``Text Fail``: Vocabulary for "Fail".
* ``Text No Quests``: Vocabulary for "No Quests Available".

### Plugin Commands
* ``PHQuestBook add Title_of_the_quest``: Add a quest in the book
* ``PHQuestBook remove Title_of_the_quest``: Remove a quest from the book
* ``PHQuestBook clear``: Clear the Quest Book
* ``PHQuestBook show``: Open the Quest Book
* ``PHQuestBook complete Title_of_the_quest``: Complete a quest and changes its icon
* ``PHQuestBook fail Title_of_the_quest``: Fail a quest and changes its icon
* ``PHQuestBook update Title_of_the_quest``: Updates an existent quest

### How to Use
* Open the database and go to the section "Common Events"
* Create a common event with the name "PHQuestBook" (without quotation marks)
* Create one or several comments to create quests.
* The comments need to follow a pattern:

    ``{Example of Quest Title [primary:iconID]}``    
    ``Description of the Quest.``

* The ``[primary]`` is optional. The quest can be ``[primary]``,``[secondary]``, ``[complete]`` or ``[fail]``. If you don't specify the priority of the quest, it will be ``[primary]`` by default.
* The ``iconID`` is also optional. You can put the ID of the icon you want to show for this quest. If you don't specify an item, the quest will get the default for its priority.
* You are allowed to have several comments meaning one quest (you don't need to use just the 6 lines for comments, you can add a new comment right below and keep going).
* You are allowed to write control characters in the description of the quest (such as \C[n], \I[n] \V[n]).
* You are allowed to use the tag ``[br]`` to break a line in the text.
* You are allowed to use some special tags to get the name of an item, weapon, armor, enemy or actor. When you are writing the description of a quest, use the tags ``<enemy:ID>``, ``<actor:ID>``, ``<item:ID>``, ``<weapon:ID>`` and ``<armor:ID>`` to print the name of the particular item on the description. Substitute ``ID`` for the corresponding number you want.
* There is also a tag called ``[break-on-update]``. This command works in the same way as ``[break]``, but it has a small difference: The content placed after ``[break-on-update]`` will just appear in the quest book when you call the plugin command ``PHQuestBook update Title_of_the_quest``.
You are allowed to have as many ``[break-on-update]`` as you want. And always when you call the plugin command for updating, it will allow the player to see a new part of the quest.
(This is a good feature if you want to have a "step-by-step" quest, where each time the player completes the quest, the same quest is updated and new things have to be done).
* To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
    Ex.: ``PHQuestBook add Example of Quest Title``

### Notes

* "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

### ChangeLog

* 12/27/2015: Version 1.3 released (Page improvements, background image and tag notations)
* 11/19/2015: Version 1.2 released (More organized layout, quests separated by category, page breaks when writing quests, allow several comments to write quests, bug fixing).
* 11/12/2015: Fixed issue about not saving quests when saving and exiting the game. Also, added some features to check status and priorities of quests via Script command.
* 11/11/2015: README.md updated
* 11/10/2015: Version 1.1 released.
* 11/08/2015: Fixed incompatibility issue that did not allowed this script to be called by the menu if other scripts being called by the menu were in the project.
* 11/03/2015: README.md updated
* 10/25/2015: Correction in the ``clear`` function, which did not allowed that other quests were added after its call.
* 10/24/2015: Version 1.0
