/*:

 PH - Quest Book
 @plugindesc This plugin allows the creation and management of a quest book.
 @author PrimeHover
 @version 1.0.1
 @date 10/24/2015

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param Show in Menu
 @desc Allows the player to see the quest book in their menu (1: true, 0: false)
 @default 1

 @param Name in Menu
 @desc Changes the name of the quest book on the menu
 @default Quest Book

 @help

 Plugin Command:
    PHQuestBook add Title_of_the_quest          # Add a quest in the book
    PHQuestBook remove Title_of_the_quest       # Remove a quest from the book
    PHQuestBook clear                           # Clear the Quest Book
    PHQuestBook show                            # Open the Quest Book

 ========================================

 How to Use:

    - Open the database and go to the section "Common Events"
    - Create a common event with the name "PHQuestBook" (without quotation marks)
    - Create one or several comments to create quests.
    - The comments need to follow a pattern:

        {Example of Quest Title}
        Description of the Quest.

    - Each comment corresponds to a single quest.
    - You are allowed to write control characters in the description of the quest (such as \C[n], \I[n]).
    - Because the comments just allow you to write 6 lines, use the tag [br] to break a line in the text.

    - To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
        Ex.: PHQuestBook add Example of Quest Title

 ========================================

 Notes:

 "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

 */

(function() {

    /* Getting the parameters */
    var parameters = PluginManager.parameters('PH_QuestBook');
    var addToMenu = Number(parameters['Show in Menu']);
    var menuText = String(parameters['Name in Menu']);

    /* Local variable for the list of quests */
    var PHQuests;

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
        this.quests = [];

        for (var i = 0; i < questVar.length; i++) {
            if (questVar[i].parameters[0]) {
                str = questVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    this.quests.push({ title: str.slice(1, str.length - 1), description: '', active: false });
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

    /* Toggle the quest according to the title */
    PHQuestBook.prototype.toggleQuest = function(title, toggle) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].active = toggle;
                i = this.quests.length;
            }
        }
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
                    for (var i = 0; i < PHQuests.quests.length; i++) {
                        PHQuests.quests[i].active = false;
                    }
                    break;
                case 'show':
                    SceneManager.push(Scene_QuestBook);
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


    /* ---------------------------------------------------------- *
     *                        MENU PROCESS                        *
     * ---------------------------------------------------------- */

    /*
     * Creates an icon on the menu for accessing the quest book
     */
    if (addToMenu == 1) {
        Window_MenuCommand.prototype.addOriginalCommands = function () {
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

    Window_QuestBookDetails.prototype.initialize = function(x, y, height) {
        Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth, height);
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
        var height = this.fittingHeight(3);
        Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, height);
        this._detailsWindow = new Window_QuestBookDetails(0, height, (Graphics.boxHeight - height));
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
        var width = rect.width - this.textPadding();
        this.drawText(quest, rect.x, rect.y, width);
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