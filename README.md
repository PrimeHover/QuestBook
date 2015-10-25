# PH_QuestBook.js
Quest Book for RPG Maker MV  
*created by PrimeHover*

### Installation
* Download the JS file and include it into the ```/plugins``` folder of your project.
* Open the Plugin Manager, select the file **PH_QuestBook.js**, and turn it on.
* You might want to choose a keycode for the corresponding key.

### Parameters
* ``Show in Menu``:  Show the Quest Book on the menu (0: no, 1: yes).
* ``Name in Menu``: Label of the Quest Book on the menu.

### How to Use
* Open the database and go to the section "Common Events"
* Create a common event with the name "PHQuestBook" (without quotation marks)
* Create one or several comments to create quests.
* The comments need to follow a pattern:

    ``{Example of Quest Title}``  
    ``Description of the Quest.``

* Each comment corresponds to a single quest
* You are allowed to write control characters in the description of the quest (such as \C[n], \I[n]).
* Because the comments just allow you to write 6 lines, use the tag [br] to break a line in the text.
* To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
    Ex.: ``PHQuestBook add Example of Quest Title``

### Notes

* "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.
