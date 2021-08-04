import {ChannelType} from "./types";
import {LoremIpsum} from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export const mockUsers = [
  {
    id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
    username: "user1",
    firstName: "Firstname",
    lastName: "Lastname"
  }
];

const mockChannels = [
  {
    id: 1,
    serverId: 1,
    groupId: null,
    type: ChannelType.Text,
    name: "channel 1",
    order: 0,
    messages: new Array(100).fill(0).map((_, index) => ({
      id: index + 1,
      serverId: 1,
      channelId: 1,
      userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
      timestamp: new Date().toString(),
      text: lorem.generateParagraphs(1),
    }))
  },
  {
    id: 2,
    serverId: 1,
    groupId: null,
    type: ChannelType.Text,
    name: "channel 2",
    order: 1,
    messages: new Array(100).fill(0).map((_, index) => ({
      id: index + 100,
      serverId: 1,
      channelId: 2,
      userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
      timestamp: new Date().toString(),
      text: lorem.generateParagraphs(1),
    }))
  },
  {
    id: 3,
    serverId: 1,
    groupId: null,
    type: ChannelType.Text,
    name: "channel 3",
    order: 2,
    messages: new Array(100).fill(0).map((_, index) => ({
      id: index + 200,
      serverId: 1,
      channelId: 3,
      userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
      timestamp: new Date().toString(),
      text: lorem.generateParagraphs(1),
    }))
  }
];

const mockMembers = [{
  id: 1,
  serverId: 1,
  userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4"
}];

const mockGroups = [
  {
    id: 1,
    serverId: 1,
    name: "Text channels",
    channels: [
      {
        id: 4,
        serverId: 1,
        groupId: 1,
        type: ChannelType.Text,
        name: "channel 4",
        order: 0,
        messages: new Array(100).fill(0).map((_, index) => ({
          id: index + 300,
          serverId: 1,
          channelId: 4,
          userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
          timestamp: new Date().toString(),
          text: lorem.generateParagraphs(1),
        }))
      },
      {
        id: 5,
        serverId: 1,
        groupId: 1,
        type: ChannelType.Text,
        name: "channel 5",
        order: 1,
        messages: new Array(100).fill(0).map((_, index) => ({
          id: index + 500,
          serverId: 1,
          channelId: 5,
          userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
          timestamp: new Date().toString(),
          text: lorem.generateParagraphs(1),
        }))
      },
      {
        id: 6,
        serverId: 1,
        groupId: 1,
        type: ChannelType.Text,
        name: "channel 6",
        order: 2,
        messages: new Array(100).fill(0).map((_, index) => ({
          id: index + 600,
          serverId: 1,
          channelId: 6,
          userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
          timestamp: new Date().toString(),
          text: lorem.generateParagraphs(1),
        }))
      }
    ]
  }, {
    id: 2,
    serverId: 1,
    name: "Voice channels",
    channels: [
      {
        id: 7,
        serverId: 1,
        groupId: 2,
        type: ChannelType.Voice,
        name: "channel 7",
        order: 0,
        users: []
      },
      {
        id: 8,
        serverId: 1,
        groupId: 2,
        type: ChannelType.Voice,
        name: "channel 8",
        order: 1,
        users: []
      },
      {
        id: 9,
        serverId: 1,
        groupId: 2,
        type: ChannelType.Voice,
        name: "channel 9",
        order: 2,
        users: []
      }
    ]
  }];

export const mockServers = [
  {
    id: 1,
    name: "Server",
    userId: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
    invitation: null,
    invitationExp: null,
    channels: mockChannels,
    groups: mockGroups,
    members: mockMembers,
  }
];
