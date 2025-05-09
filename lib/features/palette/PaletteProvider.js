import { assign } from "min-dash";

/**
 * A palette provider for od elements.
 */
export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  spaceTool,
  lassoTool,
  handTool,
  globalConnect,
  translate,
) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "spaceTool",
  "lassoTool",
  "handTool",
  "globalConnect",
  "translate",
];

PaletteProvider.prototype.getPaletteEntries = function (element) {
  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape);
    }

    var shortType = type.replace(/^od:/, "");

    return {
      group: group,
      className: className,
      title: title || translate("Create {type}", { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }

  assign(actions, {
    "hand-tool": {
      group: "tools",
      className: "bpmn-icon-hand-tool",
      title: translate("Activate the hand tool"),
      action: {
        click: function (event) {
          handTool.activateHand(event);
        },
      },
    },
    "lasso-tool": {
      group: "tools",
      className: "bpmn-icon-lasso-tool",
      title: translate("Activate the lasso tool"),
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        },
      },
    },
    "space-tool": {
      group: "tools",
      className: "bpmn-icon-space-tool",
      title: translate("Activate the create/remove space tool"),
      action: {
        click: function (event) {
          spaceTool.activateSelection(event);
        },
      },
    },
    "tool-separator": {
      group: "tools",
      separator: true,
    },
    "create-object": createAction(
      "od:Object",
      "od-elements",
      "od-icon-object",
      translate("Create object"),
    ),
    "object-linker": {
      group: "od-elements",
      className: "bpmn-icon-connection",
      title: translate("Link objects"),
      action: {
        click: function (event) {
          globalConnect.start(event);
        },
      },
    },
    "od-separator": {
      group: "od-elements",
      separator: true,
    },
    "create.text-box": createAction(
      "od:TextBox",
      "text",
      "ojs-text-box",
      translate("Create text"),
    ),
    "od-separator-chr": {
      group: "od-elements",
      separator: true,
    },
    "create-profile-chr": createAction(
      "chr:Profile",
      "od-elements",
      "od-icon-object",
      translate("Create Profile"),
    ),
  });

  return actions;
};
