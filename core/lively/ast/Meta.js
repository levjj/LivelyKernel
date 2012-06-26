module('lively.ast.Meta').requires('lively.ast.Interpreter').toRun(function() {

// Meta-Programming functions for displaying and saving functions
Object.extend(Function.prototype, {
    toSource: function() {
        if (!this.source) {
            this.source = this.toString()
                .replace(/^function[^\(]*/, "function " + this.methodName);
        }
        return this.source;
    },
    updateSource: function(source) {
        var ast = lively.ast.Parser.parse(source, "functionDef");
        var newFun = ast.val.asFunction(this);
        newFun.source = source;
        newFun.locallyChanged = true;
        //TODO: This should probably use 'addMethod' instead
        this.getClass().prototype[this.methodName] = newFun;
        lively.bindings.signal(this, 'localSource', newFun);
        lively.ast.Meta.ChangeSet.getCurrent().addChange(newFun);
    },
    getClass: function() {
        return Class.forName(this.declaredClass);
    },
});

// Skeleton for ChangeSets support - still work in Progress
Object.subclass('lively.ast.Meta.ChangeSet',
'initializing', {
    initialize: function() {
        this.changes = [];
    },
},
'managing', {
    addChange: function(fun) {
        this.changes.push(fun);
        lively.bindings.signal(this.constructor, 'current', this);
    }
},
'persistence', {
    commit: function() {
        throw new Error('not implemented yet');
    }
},
'merging', {
    mergeWithCurrent: function() {
        throw new Error('not implemented yet');        
    }
});
Object.extend(lively.ast.Meta.ChangeSet, {
    current: null,
    getCurrent: function() {
        if (!this.current) {
            this.current = new this();
        }
        return this.current;
    },
});

}) // end of module