/*:

 PH - Quest Book
 @plugindesc This plugin allows the creation and management of a quest book via a Common Event and Plugin Commands.
 @author PrimeHover
 @version 1.3.1
 @date 01/11/2016

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Screen Options---
 @default

 @param Show in Menu
 @desc Allows having access of the quest book via menu (1: true, 0: false) (Ignore it if you are using Yanfly Main Menu Manager)
 @default 1

 @param Name in Menu
 @desc Changes the name of the quest book on the menu (Ignore it if you are using Yanfly Main Menu Manager)
 @default Quest Book

 @param Display Type
 @desc Changes the position of the window (0: top view, 1: side view)
 @default 1

 @param Show Icons
 @desc Show an icon before the name of the quest (1: yes, 0: no)
 @default 1

 @param Background Image
 @desc Image for background of the quest book (PNG image only; Leave it in blank to have the default background)
 @default

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

 @param ---Vocabulary Options---
 @default

 @param Text Primary
 @desc Vocabulary for "Primary"
 @default Primary

 @param Text Secondary
 @desc Vocabulary for "Secondary"
 @default Secondary

 @param Text Complete
 @desc Vocabulary for "Complete"
 @default Complete

 @param Text Fail
 @desc Vocabulary for "Fail"
 @default Fail

 @param Text No Quests
 @desc Text to be shown when no quests are available
 @default No Quests Available

 @help

 Plugin Command:
    PHQuestBook add Title_of_the_quest          # Add a quest in the book
    PHQuestBook remove Title_of_the_quest       # Remove a quest from the book
    PHQuestBook clear                           # Clear the Quest Book
    PHQuestBook show                            # Open the Quest Book
    PHQuestBook complete Title_of_the_quest     # Complete a quest and changes its icon
    PHQuestBook fail Title_of_the_quest         # Fail a quest and changes its icon
    PHQuestBook update Title_of_the_quest       # Updates an existent quest

 ========================================

 How to Use:

    - Open the database and go to the section "Common Events"
    - Create a common event with the name "PHQuestBook" (without quotation marks)
    - Create one or several comments to create quests.
    - The comments need to follow a pattern:

        {Example of Quest Title [primary:iconID]}
        Description of the Quest.

    - The [primary] is optional. The quest can be [primary], [secondary], [complete] or [fail]. If you don't specify the priority of the quest, it will be [primary] by default.
    - The "iconID" is also optional. You can put the ID of the icon you want to show for this quest. If you don't specify an item, the quest will get the default for its priority.
    - You are allowed to have several comments meaning one quest (you don't need to use just the 6 lines for comments, you can add a new comment right below and keep going).
    - You are allowed to write control characters in the description of the quest (such as \C[n], \I[n], \V[n]).
    - You are allowed to use the tag [br] to break a line in the text.
    - You are allowed to use some special tags to get the name of an item, weapon, armor, enemy or actor. When you are writing the description of a quest, use the tags <enemy:ID>, <actor:ID>, <item:ID>, <weapon:ID> and <armor:ID> to print the name of the particular item on the description. Substitute ID for the corresponding number you want.
    - There is also a tag called [break-on-update] . This command works in the same way as [break], but it has a small difference: The content placed after [break-on-update] will just appear in the quest book when you call the plugin command "PHQuestBook update Title_of_the_quest".
      You are allowed to have as many [break-on-update] as you want. And always when you call the plugin command for updating, it will allow the player to see a new part of the quest.
      (This is a good feature if you want to have a "step-by-step" quest, where each time the player completes the quest, the same quest is updated and new things have to be done).

    - To register a quest in the book, create an event in the map, go to "Plugin Command" and type the command for adding the quest
        Ex.: PHQuestBook add Example of Quest Title
    - To check the status or priority of the quest, you can use these Script commands:

    PHPlugins.PHQuests.isActive("Title of the Quest");
    PHPlugins.PHQuests.isComplete("Title of the Quest");
    PHPlugins.PHQuests.isSecondary("Title of the Quest");
    PHPlugins.PHQuests.isPrimary("Title of the Quest");
    PHPlugins.PHQuests.isFail("Title of the Quest");

 ========================================

 Notes:

 "Example of Quest Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

 */

/* Global variable for PH Plugins */
var PHPlugins = PHPlugins || {};
PHPlugins.Parameters = PluginManager.parameters('PH_QuestBook');
PHPlugins.Params = PHPlugins.Params || {};

/* Global variable for the list of quests */
PHPlugins.PHQuests = null;

/* Getting the parameters */
PHPlugins.Params.PHQuestAddToMenu = Number(PHPlugins.Parameters['Show in Menu']);
PHPlugins.Params.PHQuestMenuText = String(PHPlugins.Parameters['Name in Menu']);
PHPlugins.Params.PHQuestDisplayType = Number(PHPlugins.Parameters['Display Type']);
PHPlugins.Params.PHQuestBackgroundImage = String(PHPlugins.Parameters['Background Image']);

PHPlugins.Params.PHQuestDisplayIcon = Number(PHPlugins.Parameters['Show Icons']);
PHPlugins.Params.PHQuestIconPrimary = Number(PHPlugins.Parameters['Icon Primary Quest']);
PHPlugins.Params.PHQuestIconSecondary = Number(PHPlugins.Parameters['Icon Secondary Quest']);
PHPlugins.Params.PHQuestIconCompleted = Number(PHPlugins.Parameters['Icon Completed Quest']);
PHPlugins.Params.PHQuestIconFailed = Number(PHPlugins.Parameters['Icon Failed Quest']);

PHPlugins.Params.PHQuestTextPrimary = String(PHPlugins.Parameters['Text Primary']);
PHPlugins.Params.PHQuestTextSecondary = String(PHPlugins.Parameters['Text Secondary']);
PHPlugins.Params.PHQuestTextComplete = String(PHPlugins.Parameters['Text Complete']);
PHPlugins.Params.PHQuestTextFail = String(PHPlugins.Parameters['Text Fail']);
PHPlugins.Params.PHQuestTextNoQuest = String(PHPlugins.Parameters['Text No Quests']);

(function() {

    /* CLASS PHQuestBook */
    function PHQuestBook() {
        this.quests = [];
        this._lastCategory = 'primary';
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
        var checkPage;
        var descriptionIndex = 0;
        this.quests = [];

        for (var i = 0; i < questVar.length; i++) {
            if (typeof questVar[i].parameters[0] !== 'undefined') {
                str = questVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    header = this.separateTitleAndType(str);
                    this.quests.push(
                        {
                            title: header[0],
                            icon: header[1],
                            type: header[2],
                            descriptions: [''],
                            reward: [],
                            updates: 0,
                            active: false
                        }
                    );
                    descriptionIndex = 0;
                    index++;
                } else if (this.quests[index]) {
                    str = str.replace(/\[br\]/g, "\n");
                    str = this.replaceVariants(str);
                    checkPage = this.checkPageBreak(str);
                    if (checkPage == 0) {
                        this.quests[index].descriptions[descriptionIndex] += str + '\n';
                    } else if (checkPage == 1) {
                        descriptionIndex++;
                        this.quests[index].descriptions[descriptionIndex] = '';
                    }
                }
            }
        }
    };

    /* Replaces the variant tags for enemies, items, etc */
    PHQuestBook.prototype.replaceVariants = function(str) {

        var variants = ['enemy', 'item', 'weapon', 'armor', 'actor', 'skill'];
        var variantIndex = -1;

        var originalStr = '';
        var regex = /\<(.*?)\>/g;
        var matches = null;

        while ((matches = regex.exec(str)) != null) {
            originalStr = matches[0];
            matches = matches[1];
            matches = matches.split(':');
            variantIndex = variants.indexOf(matches[0]);
            if (variantIndex > -1 && typeof matches[1] !== 'undefined') {
                str = str.replace(originalStr, this.getVariantName(variants[variantIndex], parseInt(matches[1])));
            }
        }

        return str;

    };

    /* Gets the real name of the variant */
    PHQuestBook.prototype.getVariantName = function(type, id) {
        switch (type) {
            case 'enemy':
                return (typeof $dataEnemies[id] !== 'undefined' ? $dataEnemies[id].name : '');
                break;
            case 'item':
                return (typeof $dataItems[id] !== 'undefined' ? $dataItems[id].name : '');
                break;
            case 'weapon':
                return (typeof $dataWeapons[id] !== 'undefined' ? $dataWeapons[id].name : '');
                break;
            case 'armor':
                return (typeof $dataArmors[id] !== 'undefined' ? $dataArmors[id].name : '');
                break;
            case 'actor':
                return (typeof $dataActors[id] !== 'undefined' ? $dataActors[id].name : '');
                break;
            case 'skill':
                return (typeof $dataSkills[id] !== 'undefined' ? $dataSkills[id].name : '');
                break;
        }
    };

    /* Checks if the string is a title or a description */
    PHQuestBook.prototype.checkTitle = function(str) {
        if (str.charAt(0) == "{" && str.charAt(str.length - 1) == "}") {
            return true;
        }
        return false;
    };

    /* Checks if the string is a break page */
    PHQuestBook.prototype.checkPageBreak = function(str) {
        if (str.indexOf('[break-on-update]') > -1) {
            return 1;
        }
        return 0;
    };

    /* Separates the title from the type of the quest (primary, secondary, etc) */
    PHQuestBook.prototype.separateTitleAndType = function(str) {
        var regExpIcon = /\[([^)]+)\]/;
        var regExpTitle = /\{([^)]+)\}/;
        var matches = regExpIcon.exec(str);

        var title;
        var icon;
        var category;

        if (matches == null) {
            icon = PHPlugins.Params.PHQuestIconPrimary;
            category = 'primary';
            title = regExpTitle.exec(str);
            if (title != null) {
                title = title[1].trim();
            } else {
                title = '';
            }
        } else {
            title = str.replace(matches[0], '');
            matches[1] = matches[1].split(':');
            title = regExpTitle.exec(title);
            category = matches[1][0];
            if (title != null) {
                title = title[1].trim();
            } else {
                title = '';
            }
            if (typeof matches[1][1] !== 'undefined' && !isNaN(parseInt(matches[1][1]))) {
                icon = parseInt(matches[1][1]);
            } else {
                icon = this.getIconForCategory(category);
            }
        }

        return [
            title, icon, category
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

    /* Updates the quest to show more instructions */
    PHQuestBook.prototype.updateQuest = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                console.log('find');
                if (this.quests[i].updates + 1 <= this.quests[i].descriptions.length - 1) {
                    this.quests[i].updates = this.quests[i].updates + 1;
                    i = this.quests.length;
                }
            }
        }
    };

    /* Get the quantity of quests for the category menu */
    PHQuestBook.prototype.getQuantityQuests = function() {
        var counter = { primary: 0, secondary: 0, complete: 0, fail: 0 };
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].active) {
                counter[this.quests[i].type]++;
            }
        }
        return counter;
    };

    /* Get the quests for the list */
    PHQuestBook.prototype.getAvailableQuests = function() {
        var quests = [];
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].active && this.quests[i].type == this._lastCategory) {
                quests.push( { quest: this.quests[i], _index: i } );
            }
        }
        return quests;
    };

    /* Get the full description of a quest */
    PHQuestBook.prototype.getFullDescription = function(index) {
        if (typeof this.quests[index] !== 'undefined' && typeof this.quests[index].descriptions[this.quests[index].updates] !== 'undefined') {
            var str = '';
            str += this.quests[index].descriptions[this.quests[index].updates];
            for (var i = this.quests[index].updates - 1; i >= 0; i--) {
                str += '\n\n' + this.quests[index].descriptions[i];
            }
            return str;
        }
        return '';
    };

    /* Get the quantity of pages to draw */
    PHQuestBook.prototype.getQuantityPages = function(index) {
        if (typeof this.quests[index] !== 'undefined') {
            if (this.quests[index].updates.length == 0) {
                return this.quests[index].descriptions.length;
            } else {
                return this.quests[index].updates[0];
            }
        }
        return 0;
    };

    /* Clear quests */
    PHQuestBook.prototype.clearQuests = function() {
        for (var i = 0; i < PHPlugins.PHQuests.quests.length; i++) {
            PHPlugins.PHQuests.quests[i].active = false;
        }
    };

    /* Complete a quest */
    PHQuestBook.prototype.completeQuest = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].icon = PHPlugins.Params.PHQuestIconCompleted;
                this.quests[i].type = 'complete';
                i = this.quests.length;
            }
        }
    };

    /* Fail a quest */
    PHQuestBook.prototype.failQuest = function(title) {
        for (var i = 0; i < this.quests.length; i++) {
            if (this.quests[i].title == title) {
                this.quests[i].icon = PHPlugins.Params.PHQuestIconCompleted;
                this.quests[i].type = 'fail';
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

    /* Gets the symbol for the category */
    PHQuestBook.prototype.getIconForCategory = function(symbol) {
        switch (symbol) {
            case 'primary':
                return PHPlugins.Params.PHQuestIconPrimary;
                break;
            case 'secondary':
                return PHPlugins.Params.PHQuestIconSecondary;
                break;
            case 'complete':
                return PHPlugins.Params.PHQuestIconCompleted;
                break;
            case 'fail':
                return PHPlugins.Params.PHQuestIconFailed;
                break;
            default:
                return PHPlugins.Params.PHQuestIconPrimary;
                break;
        }
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
        if (index > -1 && this.quests[index].type == 'primary') {
            return true;
        }
        return false;
    };

    /* Checks if a quest is secondary */
    PHQuestBook.prototype.isSecondary = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].type == 'secondary') {
            return true;
        }
        return false;
    };

    /* Checks if a quest is completed */
    PHQuestBook.prototype.isComplete = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].type == 'complete') {
            return true;
        }
        return false;
    };

    /* Checks if a quest is failed */
    PHQuestBook.prototype.isFail = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.quests[index].type == 'fail') {
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
                    PHPlugins.PHQuests.toggleQuest(getAllArguments(args), true);
                    break;
                case 'remove':
                    PHPlugins.PHQuests.toggleQuest(getAllArguments(args), false);
                    break;
                case 'clear':
                    PHPlugins.PHQuests.clearQuests();
                    break;
                case 'show':
                    SceneManager.push(Scene_QuestBook);
                    break;
                case 'complete':
                    PHPlugins.PHQuests.completeQuest(getAllArguments(args));
                    break;
                case 'fail':
                    PHPlugins.PHQuests.failQuest(getAllArguments(args));
                    break;
                case 'update':
                    PHPlugins.PHQuests.updateQuest(getAllArguments(args));
                    break;
            }
        }
    };


    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /* Creating PHQuests when creating objects */
    var _DataManager_createGameObjects_ = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects_.call(this);
        if (typeof $dataCommonEvents !== "undefined") {
            PHPlugins.PHQuests = new PHQuestBook();
            PHPlugins.PHQuests.getPHQuestCommonEvent();
        }
    };

    /*
     * Populating PHQuests variable after loading the whole database
     */
    var _DataManager_onLoad_ = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad_.call(this, object);
        if (object === $dataCommonEvents) {
            if (PHPlugins.PHQuests == null) {
                PHPlugins.PHQuests = new PHQuestBook();
                PHPlugins.PHQuests.getPHQuestCommonEvent();
            }
        }
    };

    /* Saves the quests when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.quests = PHPlugins.PHQuests.quests;
        return contents;
    };

    /* Retrieve the quests from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        PHPlugins.PHQuests = new PHQuestBook();
        PHPlugins.PHQuests.quests = contents.quests;
    };

})();

/* ---------------------------------------------------------- *
 *                        MENU PROCESS                        *
 * ---------------------------------------------------------- */

/*
 * Creates an icon on the menu for accessing the quest book
 * It's compatible with Yanfly Main Menu Manager as well
 */
if (PHPlugins.Params.PHQuestAddToMenu == 1 && (typeof Yanfly === "undefined" || typeof Yanfly.MMM === "undefined")) {
    var Window_MenuCommand_prototype_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        Window_MenuCommand_prototype_addOriginalCommands.call(this);
        this.addCommand(PHPlugins.Params.PHQuestMenuText, 'questbook');
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
 * WINDOW QUEST BOOK CATEGORY
 */
function Window_QuestBookCategory() {
    this.initialize.apply(this, arguments);
}
Window_QuestBookCategory.prototype = Object.create(Window_Command.prototype);
Window_QuestBookCategory.prototype.constructor = Window_QuestBookCategory;

Window_QuestBookCategory.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this._questQuantity = PHPlugins.PHQuests.getQuantityQuests();
    this.select(0);
};

Window_QuestBookCategory.prototype.setListWindow = function(window) {
    this._listWindow = window;
};

Window_QuestBookCategory.prototype.setQuestCategory = function() {
    PHPlugins.PHQuests._lastCategory = this.currentSymbol() || 'primary';
};

Window_QuestBookCategory.prototype.maxCols = function() {
    var qtty = 1;
    if (this._questQuantity.secondary > 0) {
        qtty++;
    }
    if (this._questQuantity.complete > 0) {
        qtty++;
    }
    if (this._questQuantity.fail > 0) {
        qtty++;
    }
    return qtty;
};

Window_QuestBookCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_QuestBookCategory.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_QuestBookCategory.prototype.makeCommandList = function() {
    this._questQuantity =  this._questQuantity || PHPlugins.PHQuests.getQuantityQuests();
    if (this._questQuantity.primary > 0) {
        this.addCommand(PHPlugins.Params.PHQuestTextPrimary, 'primary', true);
    }
    if (this._questQuantity.secondary > 0) {
        this.addCommand(PHPlugins.Params.PHQuestTextSecondary, 'secondary', true);
    }
    if (this._questQuantity.complete > 0) {
        this.addCommand(PHPlugins.Params.PHQuestTextComplete, 'complete', true);
    }
    if (this._questQuantity.fail > 0) {
        this.addCommand(PHPlugins.Params.PHQuestTextFail, 'fail', true);
    }
    if (this._questQuantity.primary <= 0 && this._questQuantity.secondary <= 0 && this._questQuantity.complete <= 0 && this._questQuantity.fail <= 0) {
        this.addCommand(PHPlugins.Params.PHQuestTextNoQuest, 'noquest', false);
    }
};

Window_QuestBookCategory.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = 'left';
    this.resetTextColor();

    var iconWidth = Window_Base._iconWidth + 3;
    if (PHPlugins.Params.PHQuestDisplayIcon == 1 && this.findSymbol('noquest') == -1) {
        this.drawIcon(PHPlugins.PHQuests.getIconForCategory(this.commandSymbol(index)), rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x + iconWidth, rect.y, rect.width - iconWidth, align);
};

Window_QuestBookCategory.prototype.itemTextAlign = function() {
    return 'center';
};

Window_QuestBookCategory.prototype.refresh = function() {
    Window_Command.prototype.refresh.call(this);
};

Window_QuestBookCategory.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    this.setQuestCategory();
    this._listWindow.refresh();
};




/*
 * WINDOW QUEST BOOK DETAILS
 */
function Window_QuestBookDetails() {
    this.initialize.apply(this, arguments);
}

Window_QuestBookDetails.prototype = Object.create(Window_Selectable.prototype);
Window_QuestBookDetails.prototype.constructor = Window_QuestBookDetails;

Window_QuestBookDetails.prototype.initialize = function() {

    var height;
    var categoryHeight = this.fittingHeight(1);

    this._questPage = 0;
    this._lastTotalPages = 0;

    if (PHPlugins.Params.PHQuestDisplayType == 0) {
        height = this.fittingHeight(3);
        Window_Selectable.prototype.initialize.call(this, 0, categoryHeight + height, Graphics.boxWidth, Graphics.boxHeight - height - categoryHeight);
    } else if (PHPlugins.Params.PHQuestDisplayType == 1) {
        height = parseInt((Graphics.boxWidth * 2) / 6);
        Window_Selectable.prototype.initialize.call(this, height, categoryHeight, Graphics.boxWidth - height, Graphics.boxHeight - categoryHeight);
    }

};

Window_QuestBookDetails.prototype.setQuestIndex = function(index) {
    this._questIndex = index;
};

Window_QuestBookDetails.prototype.setQuestPage = function(page) {
    this._questPage = page;
};

Window_QuestBookDetails.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    if (this._questIndex > -1) {
        this.drawQuestTextEx(PHPlugins.PHQuests.getFullDescription(this._questIndex), 0, 0);
    }
};

Window_QuestBookDetails.prototype.drawQuestTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(this.verifyFontSize(text));
        textState.height = this.calcTextHeight(textState, false);
        textState.y -= this._questPage * textState.height;
        textState.text = this.formatQuest(textState.text, textState.height);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

Window_QuestBookDetails.prototype.formatQuest = function(text, height) {

    var quest = text;
    var finalText = '';

    var totalSize = 0;
    var textWidth = 0;
    var btmWidth = this.contentsWidth();
    var spaceWidth = this.textWidth(' ');

    var totalPages = 0;
    var totalHeight = 0;
    var btmHeight = this.contentsHeight();

    quest = quest.split(' ');
    for (var i = 0; i < quest.length; i++) {
        if (quest[i].indexOf('\n') == -1) {
            textWidth = this.textWidth(quest[i]);
            if (totalSize + textWidth <= btmWidth) {
                finalText += quest[i] + ' ';
                totalSize += textWidth + spaceWidth;
            } else {
                finalText += '\n';
                finalText += quest[i] + ' ';
                totalSize = textWidth + spaceWidth;
                totalHeight += height;
                if (totalHeight > btmHeight) totalPages++;
            }
        } else {
            quest[i] = quest[i].split('\n');
            for (var j = 0; j < quest[i].length; j++) {
                textWidth = this.textWidth(quest[i][j]);
                if (totalSize + textWidth > btmWidth) {
                    finalText += '\n';
                    totalSize = 0;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
                finalText += quest[i][j] + ' ';
                totalSize += textWidth + spaceWidth;
                if (j + 1 < quest[i].length) {
                    finalText += '\n';
                    totalSize = textWidth + spaceWidth;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
            }
        }
    }

    this._lastTotalPages = totalPages;
    return finalText;

};

Window_QuestBookDetails.prototype.verifyFontSize = function(text) {
    return text.replace(/\\{/g, '').replace(/\\}/g, '');
};

Window_QuestBookDetails.prototype.allowPageUp = function() {
    return this._questPage > 0;
};

Window_QuestBookDetails.prototype.allowPageDown = function() {
    if (this._questPage < this._lastTotalPages) {
        return true;
    }
    return false;
};

Window_QuestBookDetails.prototype.updateArrows = function() {
    this.downArrowVisible = this.allowPageDown();
    this.upArrowVisible = this.allowPageUp();
};

Window_QuestBookDetails.prototype.isCursorMovable = function() {
    return this.isOpenAndActive();
};

Window_QuestBookDetails.prototype.processWheel = function() {
    if (this.isOpenAndActive()) {
        var threshold = 10;
        if (TouchInput.wheelY >= threshold) {
            this.cursorDown();
        }
        if (TouchInput.wheelY <= -threshold) {
            this.cursorUp();
        }
    }
};

Window_QuestBookDetails.prototype.cursorDown = function() {
    if (this.allowPageDown()) {
        SoundManager.playCursor();
        this._questPage++;
        this.refresh();
    }
};

Window_QuestBookDetails.prototype.cursorUp = function() {
    if (this.allowPageUp()) {
        SoundManager.playCursor();
        this._questPage--;
        this.refresh();
    }
};

Window_QuestBookDetails.prototype.cursorPagedown = function() {
    this.cursorDown();
};

Window_QuestBookDetails.prototype.cursorPageup = function() {
    this.cursorUp();
};



/*
 * WINDOW QUEST BOOK LIST
 */
function Window_QuestBookList() {
    this.initialize.apply(this, arguments);
}

Window_QuestBookList.prototype = Object.create(Window_Selectable.prototype);
Window_QuestBookList.prototype.constructor = Window_QuestBookList;

Window_QuestBookList.prototype.initialize = function() {

    this._questList = [];

    var height;
    var categoryHeight = this.fittingHeight(1);

    if (PHPlugins.Params.PHQuestDisplayType == 0) {
        height = this.fittingHeight(3);
        Window_Selectable.prototype.initialize.call(this, 0, categoryHeight, Graphics.boxWidth, height);
    } else if (PHPlugins.Params.PHQuestDisplayType == 1) {
        height = parseInt((Graphics.boxWidth * 2) / 6);
        Window_Selectable.prototype.initialize.call(this, 0, categoryHeight, height, Graphics.boxHeight - categoryHeight);
    }

    this.refresh();
};

Window_QuestBookList.prototype.setDetailWindow = function(window) {
    this._detailWindow = window;
};

Window_QuestBookList.prototype.maxItems = function() {
    return this._questList.length;
};

Window_QuestBookList.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.drawQuestList();
};

Window_QuestBookList.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this.index() > -1) {
        this._detailWindow.setQuestIndex(this._questList[this.index()]._index);
    } else {
        this._detailWindow.setQuestIndex(-1);
    }
    this._detailWindow.refresh();
};

Window_QuestBookList.prototype.drawQuestList = function() {
    this._questList = PHPlugins.PHQuests.getAvailableQuests();
    for (var i = 0; i < this._questList.length; i++) {
        this.drawQuest(this._questList[i].quest, i);
    }
};

Window_QuestBookList.prototype.drawQuest = function(quest, index) {

    var title = quest.title;
    var rect = this.itemRectForText(index);

    var iconWidth = Window_Base._iconWidth + 3;
    if (PHPlugins.Params.PHQuestDisplayIcon == 1) {
        this.drawIcon(quest.icon, rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    var width = rect.width - this.textPadding() - iconWidth;
    this.drawText(title, rect.x + iconWidth, rect.y, width);
};





/* ---------------------------------------------------------- *
 *                        SCENE PROCESS                       *
 * ---------------------------------------------------------- */

/*
 * Create the scene of the quest book
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

    this.createWindowDetail();
    this.createWindowList();
    this.createWindowCategory();
    this.changeWindowsOpacity();

};

if (PHPlugins.Params.PHQuestBackgroundImage != '') {
    Scene_QuestBook.prototype.createBackground = function () {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(PHPlugins.Params.PHQuestBackgroundImage);
        this.addChild(this._backgroundSprite);
    };
}

Scene_QuestBook.prototype.createWindowCategory = function() {
    this._categoryWindow = new Window_QuestBookCategory();
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setListWindow(this._listWindow);
    this.addWindow(this._categoryWindow);
};

Scene_QuestBook.prototype.createWindowList = function() {
    this._listWindow = new Window_QuestBookList();
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setDetailWindow(this._detailWindow);
    this.addWindow(this._listWindow);
};

Scene_QuestBook.prototype.createWindowDetail = function() {
    this._detailWindow = new Window_QuestBookDetails();
    this._detailWindow.setHandler('cancel', this.onDetailCancel.bind(this));
    this.addWindow(this._detailWindow);
};

Scene_QuestBook.prototype.changeWindowsOpacity = function() {
    if (PHPlugins.Params.PHQuestBackgroundImage != '') {
        this._categoryWindow.opacity = 0;
        this._listWindow.opacity = 0;
        this._detailWindow.opacity = 0;
    }
};

Scene_QuestBook.prototype.onCategoryOk = function() {
    this._detailWindow._questPage = 0;
    this._categoryWindow.setQuestCategory();
    this._categoryWindow.deactivate();
    this._listWindow.select(0);
    this._listWindow.activate();
};

Scene_QuestBook.prototype.onListCancel = function() {
    this._listWindow.deselect();
    this._listWindow.deactivate();
    this._categoryWindow.activate();
};

Scene_QuestBook.prototype.onListOk = function() {
    this._listWindow.deactivate();
    this._detailWindow.activate();
};

Scene_QuestBook.prototype.onDetailCancel = function() {
    this._detailWindow._questPage = 0;
    this._detailWindow.deactivate();
    this._listWindow.activate();
};