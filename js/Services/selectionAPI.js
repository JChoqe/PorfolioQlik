define([
    'js/qlik',
    'app'
], function (qlik, app) {
    app.service('selectionAPI', ['$q', '$rootScope', function ($q, $rootScope) {

        this.applySelection = async function (APP, FIELDNAME, VALUES) {
            try {
                const _valuesField = await getValues(APP, FIELDNAME);
                const _positionsValues = await getPositionsValues(_valuesField, VALUES);
                APP.field(FIELDNAME).select(_positionsValues, false, true);
            } catch (error) {
                console.error(error);
            }
        }

        async function getPositionsValues(allval, options) {
            return allval
                .filter(value => options.includes(value.qText))
                .map(val => val.qElemNumber);
        }

        async function getValues(APP, FIELDNAME) {
            const reply = await createList(APP, FIELDNAME);
            const _valuesField = reply.qListObject.qDataPages[0].qMatrix.map(value => value[0]);
            destroySessionObject(APP, reply.qInfo.qId);
            return _valuesField;
        }

        function createList(APP, FIELDNAME) {
            return new Promise((resolve, reject) => {
                APP.createList({
                    "qDef": {
                        "qFieldDefs": [FIELDNAME]
                    },
                    "qInitialDataFetch": [{
                        qTop: 0,
                        qLeft: 0,
                        qHeight: 5000,
                        qWidth: 1
                    }]
                }, function (reply) {
                    resolve(reply);
                });
            });
        }

        function destroySessionObject(APP, qId) {
            APP.destroySessionObject(qId);
        }
    }]);
});
