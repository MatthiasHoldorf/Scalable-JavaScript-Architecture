Core.DomManipulation.ready(document, function(){

    ///////////////////
    // Core
    assert.context("*********************");
    assert.context("Core");

    ///////////////////
    // Core.register
    assert.context("Core.register");

    // act

    // #1 The moduleId is not a string
    try {
        Core.register(1, null);
    }
    catch(e){
        assert.equals(e.message === "The moduleId is not a string", "#1 The moduleId is not a string");
    }

    // #2 The moduleId must contain at least 2 characters
    try {
        Core.register("1", null);
    }
    catch(e){
        assert.equals(e.message === "The moduleId must contain at least 2 characters", "#2 The moduleId must contain at least 2 characters");
    }

    // #3 The creator must be a function
    try {
        Core.register("12", null);
    }
    catch(e){
        assert.equals(e.message === "The creator must be a function", "#3 The creator must be a function");
    }

    // #4 Module successfully registered
    Core.register("module-name", function() {});
    assert.equals(Core.getModuleData().hasOwnProperty("module-name"), "#4 Registered module successfully");



    ///////////////////
    // Core.remove
    assert.context("Core.remove");

    // act

    // #1 Removed module successfully
    Core.remove("module-name");
    assert.equals(!(Core.getModuleData().hasOwnProperty("module-name")), "#5 Removed module successfully");



    ///////////////////
    // Core.start
    assert.context("Core.start");

    // arrange

    Core.register("no property", function() {});

    Core.register("only one property", function() {
        return {
            init: null
        }
    });

    Core.register("properties aren't function", function() {
        return {
            init: null,
            destroy: null
        }
    });

    Core.register("valid module registration", function() {
        return {
            init: function() {},
            destroy:  function() {}
        }
    });

    // act

    // #1 The creator doesn't have properties
    try {
       Core.start("no property");
    }
    catch(e){
       assert.equals(e.message === "The creator must have a property init of type function", "#6 The creator doesn't have properties");
    }

    // #2 The creator only have a property init
    try {
        Core.start("only one property")
    }
    catch(e){
        assert.equals(e.message === "The creator must have a property init of type function", "#7 The creator only have a property init");
    }

    // #3 The creator's properties init and destroy aren't of type function
    try {
        Core.start("properties aren't function")
    }
    catch(e){
        assert.equals(e.message === "The creator must have a property init of type function", "#8 The creator's properties init and destroy aren't of type function");
    }

    // #4 Started module successfully
    Core.start("valid module registration");
    assert.equals(Core.getRunningModules().hasOwnProperty("valid module registration"), "#9 Started module successfully");

});