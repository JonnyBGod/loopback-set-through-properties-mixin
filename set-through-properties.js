'use strict';

module.exports = function(Model, options) {
  Model.on('attached', function() {
    var relations = Model.settings.relations || Model.relations;

    if (relations) {
      Object.keys(relations).forEach(function(targetModel) {
        var type = (relations[targetModel].modelThrough || relations[targetModel].through) ?
          'hasManyThrough' : relations[targetModel].type;

        if (type === 'hasManyThrough') {
          Model.beforeRemote('prototype.__create__' + targetModel, extractThroughProperties);
          Model.beforeRemote('prototype.__updateById__' + targetModel, extractThroughProperties);
          Model.beforeRemote('prototype.__link__' + targetModel, extractThroughProperties);

          Model.afterRemote('prototype.__create__' + targetModel, updateThroughModel);
          Model.afterRemote('prototype.__updateById__' + targetModel, updateThroughModel);
          Model.afterRemote('prototype.__link__' + targetModel, updateThroughModel);
        }
      });
    }
  });

  function extractThroughProperties(ctx, unused, next) {
    var relationName = ctx.methodString.match(/__([a-z\d]+)$/)[1];
    var throughModelName = Model.relations[relationName].modelThrough.definition.name;

    if (ctx.args.data && ctx.args.data[throughModelName]) {
      ctx.hookState = {
        relationName: relationName,
        throughModelName: throughModelName,
        data: ctx.args.data[throughModelName],
      };
      delete ctx.args.data[throughModelName];
    }

    next();
  }

  function updateThroughModel(ctx, unused, next) {
    if (!ctx.result) return next();
    if (
      !ctx.hookState ||
      !ctx.hookState.relationName ||
      !ctx.hookState.throughModelName ||
      !ctx.hookState.data
    ) return next();

    var relationKey = Model.relations[ctx.hookState.relationName].keyTo;
    var throughKey = Model.relations[ctx.hookState.relationName].keyThrough;
    var throughModel = Model.relations[ctx.hookState.relationName].modelThrough;

    var query = {};
    query[relationKey] = ctx.result.id;
    query[throughKey] = ctx.instance.id;

    throughModel.updateAll(query, ctx.hookState.data, next);
  }
};
