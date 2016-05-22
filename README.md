# PH_QuestBook.js
Quest Book for RPG Maker MV  
*created by PrimeHover*
*Version 2.0*

### License
* This work is licensed under the Creative Commons Attribution 4.0 International License.
* To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
* If this plugin is very useful to you and you want to help this plugin to keep improving, consider making a small donation using the link below:
[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Q7CRGSXWBSP22)

### Installation
* Download the JS file and include it into the ```/plugins``` folder of your project.
* Open the Plugin Manager, select the file **PH_QuestBook.js**, and turn it on.
* ```IMPORTANT: If you were using the versions 1.3.1 and you want to see the documentation, there is a folder called "1.3.1" with the entire doc. However, if you want to update from the version 1.3.1 to 2.0, read the full documentation again to adapt the old setting to the new ones! I do not recommend updating if your project is above 70% done.```

### Parameters
* ``Show in Menu``: Show the Quest Book on the menu (0: no, 1: yes).
* ``Name in Menu``: Label of the Quest Book on the menu.
* ``Show Icons``: Show an icon before the name of the quest in the book (1: yes, 0: no).
* ``Background Image``: Image for background of the quest book (PNG image only; Leave it in blank to have the default background)
* ``Category IDs``: ID of the categories to be displayed separated by commas (,) (each one has to be unique!).
* ``Category Texts``: Texts of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!).
* ``Category Icons ID``: Icons of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!).
* ``Text Default Quest``: Default text to be shown when the quest does not have a specific category.
* ``Text No Quests``: Vocabulary for "No Quests Available".
* ``Text Title``: Text of the title of the book.
* ``Text Title Color``: Color for the text of the title of the book (RMMV Color Code).

### Plugin Commands
* ``PHQuestBook add Title_of_the_quest``: Add a quest in the book
* ``PHQuestBook remove Title_of_the_quest``: Remove a quest from the book
* ``PHQuestBook clear``: Clear the Quest Book
* ``PHQuestBook show``: Open the Quest Book
* ``PHQuestBook change Title_of_the_quest|category``: Changes the category of a quest
* ``PHQuestBook update Title_of_the_quest``: Updates an existent quest

### How to Use

##### CREATING A CATEGORY
* In order to create a category, you have to set 3 required parameters, which are: **Category IDs**, **Category Texts** and **Category Icons IDs**. Here is an example of these three parameters.

     ``[Category IDs]:         primary, secondary, completed, failed``      
     ``[Category Texts]:       Primary, Secondary, Completed, Failed``      
     ``[Category Icons IDs]:   312, 311, 310, 309``      

* In the example above, the "primary" in **Category IDs** will be a category. The text that will be displayed when a quest is in this category is "Primary", and the default icon for this category is the ID "312".
* As I stated earlier, you can have as many categories as you want. You just need to separate the ids, names and icons with a comma (,).
* IMPORTANT: Make sure that you have the same amount of ids, texts and icons. In other words, if you have 4 IDs, you must have 4 Texts and 4 Icons.


##### WRITING A QUEST
* Open the database and go to the section "Common Events"
* Create a common event with the name "PHQuestBook" (without quotation marks)
* Create one or several comments to create quests.
* The comments need to follow a pattern:

    ``{Example of Quest Title|categoryID|iconID}``    
    ``Description of the Quest.``

* The ``[primary]`` is optional. The quest can be ``[primary]``,``[secondary]``, ``[complete]`` or ``[fail]``. If you don't specify the priority of the quest, it will be ``[primary]`` by default.
* The ``iconID`` is also optional. You can put the ID of the icon you want to show for this quest. If you don't specify an item, the quest will get the default for its priority.
* You are allowed to have several comments meaning one quest (you don't need to use just the 6 lines for comments, you can add a new comment right below and keep going).
* You are allowed to write control characters in the description of the quest (such as \C[n], \I[n] \V[n]).
* You are allowed to use some special tags to get the name of an item, weapon, armor, enemy or actor. When you are writing the description of a quest, use the tags ``<enemy:ID>``, ``<actor:ID>``, ``<item:ID>``, ``<weapon:ID>`` and ``<armor:ID>`` to print the name of the particular item on the description. Change ``ID`` for the corresponding number you want.
* There is also a tag called ``[break-on-update]``. When you use it, all the content of the same quest will be hidden, and it will just appear in the quest book when you call the plugin command ``PHQuestBook update Title_of_the_quest``.
* You are allowed to have as many ``[break-on-update]`` as you want. And always when you call the plugin command for updating, it will allow the player to see a new part of the quest (This is a good feature if you want to have a "step-by-step" quest, where each time the player completes the quest, the same quest is updated and new things have to be done).

##### REGISTERING A QUEST ON THE BOOK
* To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
    Ex.: ``PHQuestBook add Example of Quest Title``
* To check the status or category of the quest, you can use these Script commands:       
    ``PHPlugins.PHQuests.isActive("Title of the Quest");``       
    ``PHPlugins.PHQuests.is("Title of the Quest", "categoryID");``

### NOTES

* ``Example of Quest Title`` does not need to be a single word or between quotation marks, it can be several words meaning one title.

### ChangeLog

* 05/19/2016: Version 2.0 (Infinite Categories, Title Window, New Layout, and bug fixes)
* 01/11/2016: Bug fixes (black background when using third party plugins that deals with background; update quests now working)
* 12/27/2015: Version 1.3 released (Page improvements, background image and tag notations)
* 11/19/2015: Version 1.2 released (More organized layout, quests separated by category, page breaks when writing quests, allow several comments to write quests, bug fixing).
* 11/12/2015: Fixed issue about not saving quests when saving and exiting the game. Also, added some features to check status and priorities of quests via Script command.
* 11/11/2015: README.md updated
* 11/10/2015: Version 1.1 released.
* 11/08/2015: Fixed incompatibility issue that did not allowed this script to be called by the menu if other scripts being called by the menu were in the project.
* 11/03/2015: README.md updated
* 10/25/2015: Correction in the ``clear`` function, which did not allowed that other quests were added after its call.
* 10/24/2015: Version 1.0