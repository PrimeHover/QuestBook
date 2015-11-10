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
* ``Icon Primary Quest``: ID of the icon to be displayed in case the quest is primary.
* ``Icon Secondary Quest``: ID of the icon to be displayed in case the quest is secondary.
* ``Icon Completed Quest``: ID of the icon to be displayed in case the quest is completed.
* ``Icon Failed Quest``: ID of the icon to be displayed in case the quest is failed.

### Plugin Commands
* ``PHQuestBook add Title_of_the_quest``: Add a quest in the book
* ``PHQuestBook remove Title_of_the_quest``: Remove a quest from the book
* ``PHQuestBook clear``: Clear the Quest Book
* ``PHQuestBook show``: Open the Quest Book
* ``PHQuestBook complete Title_of_the_quest``: Complete a quest and changes its icon
* ``PHQuestBook fail Title_of_the_quest``: Fail a quest and changes its icon

### How to Use
* Open the database and go to the section "Common Events"
* Create a common event with the name "PHQuestBook" (without quotation marks)
* Create one or several comments to create quests.
* The comments need to follow a pattern:

    ``{Example of Quest Title [primary]}``
    ``Description of the Quest.``

* The ``[primary]`` is optional. The quest can be ``[primary]``,``[secondary]``, ``[complete]`` or ``[fail]``. If you don't specify the priority of the quest, it will be ``[primary]`` by default.
* Each comment corresponds to a single quest
* You are allowed to write control characters in the description of the quest (such as \C[n], \I[n]).
* Because the comments just allow you to write 6 lines, use the tag [br] to break a line in the text.
* To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
    Ex.: ``PHQuestBook add Example of Quest Title``

### Notes

* "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

### ChangeLog

* 11/10/2015: Version 1.1 released.
* 11/08/2015: Fixed incompatibility issue that did not allowed this script to be called by the menu if other scripts being called by the menu were in the project.
* 11/03/2015: README.md updated
* 10/25/2015: Correction in the ``clear`` function, which did not allowed that other quests were added after its call.
* 10/24/2015: Version 1.0