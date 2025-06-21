import { restoreHandleContent } from "../editable/frame-handle";

// Mocks auxiliares
const mockFrameHandle = document.createElement("span");
(mockFrameHandle as any).placement = "after"; // simula placement

const mockFrameElement = document.createElement("div");
mockFrameElement.appendChild(mockFrameHandle);

Object.defineProperty(mockFrameHandle, "parentElement", {
  value: mockFrameElement,
});

jest.mock("./frame-handle-utils", () => ({
  isFrameHandle: (node: Node) => node === mockFrameHandle,
  skippableNode: (parent: Node, node: Node) => false,
  nodeIsElement: (node: Node): boolean => node.nodeType === 1,
  elementIsEmpty: (node: Element): boolean => node.textContent?.trim() === "",
  nodeIsText: (node: Node): boolean => node.nodeType === 3,
  get: (x: any) => false,
  spaceCharacter: " ",
  moveChildOutOfElement: jest.fn().mockImplementation((_frame, node, _placement) => node),
  placeCaretAfter: jest.fn(),
}));

describe("restoreHandleContent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve substituir espaço no frame handle por Text(spaceCharacter)", () => {
    const node = document.createElement("span");
    node.textContent = " ";

    const mutation: MutationRecord = {
      type: "childList",
      target: mockFrameHandle,
      addedNodes: [node],
      removedNodes: [],
      attributeName: null,
      attributeNamespace: null,
      nextSibling: null,
      previousSibling: null,
      oldValue: null,
    };

    restoreHandleContent([mutation]);

    expect(node.nodeType).toBe(3); // virou Text node
    expect(node.textContent).toBe(" ");
  });

  it("deve mover nó válido para fora do frame", () => {
    const node = document.createElement("strong");
    node.textContent = "abc";

    const mutation: MutationRecord = {
      type: "childList",
      target: mockFrameHandle,
      addedNodes: [node],
      removedNodes: [],
      attributeName: null,
      attributeNamespace: null,
      nextSibling: null,
      previousSibling: null,
      oldValue: null,
    };

    restoreHandleContent([mutation]);

    const { moveChildOutOfElement } = require("./frame-handle-utils");
    expect(moveChildOutOfElement).toHaveBeenCalledWith(
      mockFrameElement,
      node,
      "after"
    );
  });

  it("deve processar mutação characterData válida", () => {
    const textNode = document.createTextNode("abc");

    const parent = mockFrameHandle;
    Object.defineProperty(textNode, "parentElement", {
      value: parent,
    });

    const mutation: MutationRecord = {
      type: "characterData",
      target: textNode,
      addedNodes: [] as any,
      removedNodes: [] as any,
      attributeName: null,
      attributeNamespace: null,
      nextSibling: null,
      previousSibling: null,
      oldValue: null,
    };

    (parent as any).moveTextOutOfFrame = jest.fn().mockReturnValue(textNode);

    restoreHandleContent([mutation]);

    expect(parent.moveTextOutOfFrame).toHaveBeenCalledWith("abc");
  });
});
