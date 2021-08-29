enum OverlayTypes {
    AddServerOverlayComponent,
    CreateChannelOverlayComponent,
    CreateGroupOverlayComponent,
    CreateServerOverlayComponent,
    InvitationOverlayComponent,
    JoinServerOverlayComponent,
    ImageInputOverlayComponent,
    AddFriendOverlayComponent
}

enum SecondPanelHeaderTypes {
    friends,
    channel,
}

enum SecondPanelBodyTypes {
    friends,
    channels,
}

enum SecondPanelFooterTypes {
    generic
}

enum HeaderTypes {
    friends,
    channel, e
}

enum ThirdPanelTypes {
    allFriends,
    pendingFriendRequests,
    friendMessages,
    channelMessages
}

export {
    OverlayTypes,
    SecondPanelHeaderTypes,
    SecondPanelBodyTypes,
    SecondPanelFooterTypes,
    HeaderTypes,
    ThirdPanelTypes
};