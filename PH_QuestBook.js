/*:

 PH - Quest Book
 @plugindesc This plugin allows the creation and management of a quest book.
 @author PrimeHover
 @version 1.1.1
 @date 11/12/2015

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Screen Options---
 @default

 @param Show in Menu
 @desc Allows the player to see the quest book in their menu (1: true, 0: false)
 @default 1

 @param Name in Menu
 @desc Changes the name of the quest book on the menu
 @default Quest Book

 @param Display Type
 @desc Changes the position of the window (0: top view, 1: side view)
 @default 0

 @param Show Icons
 @desc Show an icon before the name of the quest (1: yes, 0: no)
 @default 1

 @param ---Icon Options---
 @default

 @param Icon Primary Quest
 @desc ID of the icon to be displayed in case the quest is primary
 @default 312

 @param Icon Secondary Quest
 @desc ID of the icon to be displayed in case the quest is secondary
 @default 310

 @param Icon Completed Quest
 @desc ID of the icon to be displayed in case the quest is completed
 @default 311

 @param Icon Failed Quest
 @desc ID of the icon to be displayed in case the quest is failed
 @default 308

 @help

 Plugin Command:
    PHQuestBook add Title_of_the_quest          # Add a quest in the book
    PHQuestBook remove Title_of_the_quest       # Remove a quest from the book
    PHQuestBook clear                           # Clear the Quest Book
    PHQuestBook show                            # Open the Quest Book
    PHQuestBook complete Title_of_the_quest     # Complete a quest and changes its icon
    PHQuestBook fail Title_of_the_quest         # Fail a quest and changes its icon

 ========================================

 How to Use:

    - Open the database and go to the section "Common Events"
    - Create a common event with the name "PHQuestBook" (without quotation marks)
    - Create one or several comments to create quests.
    - The comments need to follow a pattern:

        {Example of Quest Title [primary]}
        Description of the Quest.

    - The [primary] is optional. The quest can be [primary], [secondary], [complete] or [fail]. If you don't specify the priority of the quest, it will be [primary] by default.
    - Each comment corresponds to a single quest.
    - You are allowed to write control characters in the description of the quest (such as \C[n], \I[n]).
    - Because the comments just allow you to write 6 lines, use the tag [br] to break a line in the text.

    - To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
        Ex.: PHQuestBook add Example of Quest Title
    - To check the status or priority of the quest, you can use these Script commands:

        PHQuests.isActive("Title of the Quest");
        PHQuests.isComplete("Title of the Quest");
        PHQuests.isSecondary("Title of the Quest");
        PHQuests.isPrimary("Title of the Quest");
        PHQuests.isFail("Title of the Quest");

 ========================================

 Notes:

 "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

 */

/* Global variable for the list of quests */
var PHQuests;

(function() {

    /* Getting the parameters */
    var parameters = PluginManager.parameters('PH_QuestBook');
    var addToMenu = Number(parameters['Show in Menu']);
    var menuText = String(parameters['Name in Menu']);
    var displayType = Number(parameters['Display Type']);

    var displayIcon = Number(parameters['Show Icons']);
    var iconPrimary = Number(parameters['Icon Primary Quest']);
    var iconSecondary = Number(parameters['Icon Secondary Quest']);
    var iconCompleted = Number(parameters['Icon Completed Quest']);
    var iconFailed = Number(parameters['Icon Failed Quest']);

    /* CLASS PHQuestBook */
    function PHQuestBook() {
        this.quests = [];
    }
    PHQuestBook.prototype.constructor = PHQuestBook;

    /* Gets the Common Event for quests */
    PHQuestBook.prototype.getPHQuestCommonEvent = function() {

        var questVar = null;

        if ($dataCommonEvents) {
            for (var i = 0; i < $dataCommonEvents.length; i++) {
                if ($dataCommonEvents[i] instanceof Object && $dataCommonEvents[i].name == "PHQuestBook") {
                    questVar = $dataCommonEvents[i].list;
                    i = $dataCommonEvents.length;
                }
            }
        }

        if (questVar != null) {
            this.populateListOfQuests(questVar);
        }

    };

    /* Populates the quest list */
    PHQuestBook.prototype.populateListOfQuests = function(questVar) {
        var str = '';
        var index = -1;
        var header;
        this.quests = [];

        for (var i = 0; i < questVar.length; i++) {
            if (questVar[i].parameters[0]) {
                str = questVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    header = this.separateTitleAndType(str);
                    this.quests.push({ title: header[0], icon: header[1], description: '', active: false });
                    index++;
                } else if (this.quests[index]) {
                    str = str.replace(/\[br\]/g, "\n");
                    this.quests[index].description += str + "\n";
                }
            }
        }
    };

    /* Checks if the string is a title or a description */
    PHQuestBook.prototype.checkTitle = function(str) {
        if (str.charAt(0) == "{" && str.charAt(str.length - 1) == "}") {
            return true;
        }
        return false;
    };

    /* Separates the title from the type of the quest (primary, secondary, etc) */
    PHQuestBook.prototype.separateTitleAndType = function(str) {
        var regExpIcon = /\[([^)]+)\]/;
        var regExpTitle = /\{([^)]+)\}/;
        var matches = regExpIcon.exec(str);

        var title;
        var icon;

        if (matches == null) {
            icon = iconPrimary;
            title = regExpTitle.exec(str);
            if (title != null) {
                title = title[1].trim();
            } else {
                title = '';
            }
        } else {
            title = str.replace(matches[0], '');
            title = regExpTitle.exec(title);
            if (title != null) {
                title = title[1].trim();
            } else {
                title = '';
            }
            switch (matches[1]) {
                case 'primary':
                    icon = iconPrimary;
                    break;
                case 'secondary':
                    icon = iconSecondary;
                    break;
                case 'complete':
                    icon = iconCompleted;
                    break;
                case 'fail':
                    icon = iconFailed;
                    break;
                default:
                    icon = iconPrimary;
            }
        }

        return [
            title, icon
        ];

    };

    /* Toggle the quest according to the title */
    PHQuestBook.prototype.toggleQuest = function(title, toggle) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].active = toggle;
                i = this.quests.length;
            }
        }
    };

    /* Clear quests */
    PHQuestBook.prototype.clearQuests = function() {
        for (var i = 0; i < PHQuests.quests.length; i++) {
            PHQuests.quests[i].active = false;
        }
    };

    /* Complete a quest */
    PHQuestBook.prototype.completeQuest = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].icon = iconCompleted;
                i = this.quests.length;
            }
        }
    };

    /* Fail a quest */
    PHQuestBook.prototype.failQuest = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].icon = iconFailed;
                i = this.quests.length;
            }
        }
    };

    /* Gets the index of the quest title */
    PHQuestBook.prototype.findIndex = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (title == this.quests[i].title) {
                return i;
            }
        }
        return -1;
    };

    /* Checks if a quest is active */
    PHQuestBook.prototype.isActive = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].active) {
            return true;
        }
        return false;
    };

    /* Checks if a quest is primary */
    PHQuestBook.prototype.isPrimary = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].icon == iconPrimary) {
            return true;
        }
        return false;
    };

    /* Checks if a quest is secondary */
    PHQuestBook.prototype.isSecondary = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].icon == iconSecondary) {
            return true;
        }
        return false;
    };

    /* Checks if a quest is completed */
    PHQuestBook.prototype.isComplete = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].icon == iconCompleted) {
            return true;
        }
        return false;
    };

    /* Checks if a quest is failed */
    PHQuestBook.prototype.isFail = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].icon == iconFailed) {
            return true;
        }
        return false;
    };


    /* ---------------------------------------------------------- *
     *                 GAME INTERPRETER PROCESS                   *
     * ---------------------------------------------------------- */


    var getAllArguments = function(args) {
        var str = args[1].toString();
        for (var i = 2; i < args.length; i++) {
            str += ' ' + args[i].toString();
        }
        return str;
    };

    /*
     * Turn quests on and off via Plugin Command
     */
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'PHQuestBook') {
            switch (args[0]) {
                case 'add':
                    PHQuests.toggleQuest(getAllArguments(args), true);
                    break;
                case 'remove':
                    PHQuests.toggleQuest(getAllArguments(args), false);
                    break;
                case 'clear':
                    PHQuests.clearQuests();
                    break;
                case 'show':
                    SceneManager.push(Scene_QuestBook);
                    break;
                case 'complete':
                    PHQuests.completeQuest(getAllArguments(args));
                    break;
                case 'fail':
                    PHQuests.failQuest(getAllArguments(args));
                    break;
            }
        }
    };


    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /*
     * Populating PHQuests variable after loading the whole database
     */
    var _DataManager_onLoad_ = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad_.call(this, object);
        if (object === $dataCommonEvents) {
            PHQuests = new PHQuestBook();
            PHQuests.getPHQuestCommonEvent();
        }
    };

    /* Saves the quests when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.quests = PHQuests.quests;
        return contents;
    };

    /* Retrieve the quests from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        PHQuests = new PHQuestBook();
        PHQuests.quests = contents.quests;
    };


    /* ---------------------------------------------------------- *
     *                        MENU PROCESS                        *
     * ---------------------------------------------------------- */

    /*
     * Creates an icon on the menu for accessing the quest book
     */
    if (addToMenu == 1) {
        var Window_MenuCommand_prototype_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            Window_MenuCommand_prototype_addOriginalCommands.call(this);
            this.addCommand(menuText, 'questbook');
        };
        var _Scene_Menu_prototype_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            _Scene_Menu_prototype_createCommandWindow.call(this);
            this._commandWindow.setHandler('questbook', function () {
                SceneManager.push(Scene_QuestBook);
            });
        };
    }

    /* ---------------------------------------------------------- *
     *                       WINDOW PROCESS                       *
     * ---------------------------------------------------------- */

    /*
     * Windows for listing the details of a quest
     */
    function Window_QuestBookDetails() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestBookDetails.prototype = Object.create(Window_Base.prototype);
    Window_QuestBookDetails.prototype.constructor = Window_QuestBookDetails;

    Window_QuestBookDetails.prototype._details = "";

    Window_QuestBookDetails.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_QuestBookDetails.prototype.refresh = function() {
        this.contents.clear();
        this.changeTextColor(this.systemColor());
        this.drawTextEx(this._details, 0, 0);
    };


    /*
     * Windows for listing the available quests
     */
    function Window_QuestBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestBookIndex.prototype.constructor = Window_QuestBookIndex;
    Window_QuestBookIndex.prototype.availableQuests = [];

    Window_QuestBookIndex.prototype.initialize = function() {

        var height;
        if (displayType == 0) {
            height = this.fittingHeight(4);
            Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, height);
            this._detailsWindow = new Window_QuestBookDetails(0, height, Graphics.boxWidth, (Graphics.boxHeight - height));
        } else if (displayType == 1) {
            height = 320;
            Window_Selectable.prototype.initialize.call(this, 0, 0, height, Graphics.boxHeight);
            this._detailsWindow = new Window_QuestBookDetails(height, 0, Graphics.boxWidth - height, Graphics.boxHeight);
        }

        this.refresh();
        this.select(0);
        this.activate();
    };

    Window_QuestBookIndex.prototype.changeDetailsWindow = function() {
        if (this.availableQuests.length > 0) {
            if (this.availableQuests[this.index()].active) {
                this._detailsWindow._details = this.availableQuests[this.index()].description;
            } else {
                this._detailsWindow._details = "";
            }
            this._detailsWindow.refresh();
        }
    };

    Window_QuestBookIndex.prototype.maxItems = function() {
        return this.availableQuests.length;
    };

    Window_QuestBookIndex.prototype.getAvailableQuests = function() {
        this.availableQuests = [];
        for (var i = 0; i < PHQuests.quests.length; i++) {
            if (PHQuests.quests[i].active) {
                this.availableQuests.push(PHQuests.quests[i]);
            }
        }
    };

    Window_QuestBookIndex.prototype.refresh = function() {
        Window_Selectable.prototype.refresh.call(this);
        this.getAvailableQuests();
        this.drawKnownQuests();
    };

    Window_QuestBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.changeDetailsWindow();
    };

    Window_QuestBookIndex.prototype.drawKnownQuests = function() {
        for (var i = 0; i < this.availableQuests.length; i++) {
            this.drawQuest(i);
        }
    };

    Window_QuestBookIndex.prototype.drawQuest = function(index) {

        var quest = this.availableQuests[index].title;
        var rect = this.itemRectForText(index);

        var iconWidth = Window_Base._iconWidth + 3;
        if (displayIcon == 1) {
            this.drawIcon(this.availableQuests[index].icon, rect.x, rect.y + 2);
        } else {
            iconWidth = 0;
        }
        var width = rect.width - this.textPadding() - iconWidth;
        this.drawText(quest, rect.x + iconWidth, rect.y, width);
    };


    /* ---------------------------------------------------------- *
     *                        SCENE PROCESS                       *
     * ---------------------------------------------------------- */

    /*
     * Creates the scene of the quest book
     */
    function Scene_QuestBook() {
        this.initialize.apply(this, arguments);
    }

    Scene_QuestBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_QuestBook.prototype.constructor = Scene_QuestBook;

    Scene_QuestBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_QuestBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_QuestBookIndex();
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        this._detailsWindow = this._indexWindow._detailsWindow;
        this.addWindow(this._indexWindow);
        this.addWindow(this._detailsWindow);
    };


})();