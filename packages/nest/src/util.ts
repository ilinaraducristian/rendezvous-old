import { Document } from "mongoose";

function sortDocuments<T extends Document & { order: number }>(documents: T[]) {
  return documents
    .sort((c1, c2) => c1.order - c2.order)
    .map((document, i) => ({
      ...document.toObject(),
      order: i,
    }));
}

function changeDocumentOrder<T extends Document & { order: number }>(documents: T[], id: string, order: number) {
  const sortedDocuments = sortDocuments(documents);
  const index = sortedDocuments.findIndex((document) => document.id === id);
  const document = sortedDocuments[index];
  sortedDocuments[index] = undefined;
  sortedDocuments.splice(order, 0, document);
  return sortedDocuments.filter((channel) => channel !== undefined);
}

function getMaxOrder(elements: { order: number }[]) {
  try {
    return elements.reduce((c1, c2) => (c1.order > c2.order ? c1 : c2)).order;
  } catch (e) {
    return -1;
  }
}

export { sortDocuments, changeDocumentOrder, getMaxOrder };
