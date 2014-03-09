Core.DomManipulation.ready(document, function(){
    var channel = "channel",

        subscriptionsReceive = "",

        subscriber = {
            fn : function( args ) {
                subscriptionsReceive = args;
            }
        };

    ///////////////////
    // Core.Mediator
    assert.context("*********************");
    assert.context("Core.Mediator");

    ///////////////////
    // Core.mediator.subscribe
    assert.context("Core.Mediator.subscribe");

    // arrange

    Core.Mediator.subscribe(channel, subscriber.fn);

    // act

    // #1 Registered new channel for subscriber
    assert.equals(Core.Mediator.getSubscriptions().hasOwnProperty(channel), "#10 Registered new channel for subscriber");

    // #2 Added the according function to the new channel
    assert.equals(Core.Mediator.getSubscriptions()[channel][0] === subscriber.fn, "#11 Added the according function to the new channel");



    ///////////////////
    // Core.mediator.unsubscribe
    assert.context("Core.Mediator.unsubscribe");

    // act

    // #1 There is one function in the subscription channel
    assert.equals(Core.Mediator.getSubscriptions()[channel].length === 1, "#12 There is one function in the subscription channel");

    // #2 Removed subscriptions (there is none subscription in the channel)
    Core.Mediator.unsubscribe("channel", subscriber.fn);
    assert.equals(Core.Mediator.getSubscriptions()[channel].length === 0, "#13 Removed subscription (there is none subscription in the channel)");



    ///////////////////
    // Core.mediator.publish
    assert.context("Core.Mediator.publish");

    // arrange

    Core.Mediator.subscribe(channel, subscriber.fn);

    // act

    // #1 Publish successful - subscriber received published arguments
    Core.Mediator.publish(channel, "published arguments");
    assert.equals(subscriptionsReceive === "published arguments", "#14 Publish successful - subscriber received published arguments");

});