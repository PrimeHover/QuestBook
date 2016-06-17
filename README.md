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

### How to Use
* You can check out the full documentation with all the rules and settings in [HERE](http://primehover.gufernandes.com.br/ph-quest-book).

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
