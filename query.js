class WordBook {
    constructor(_dicName='', _wordBook={}) {
        this.name=_dicName;
        this.wordBook = _wordBook;
    }
    static Info = 
                    '-> new WordBook("myName",{"propertyName":[], ...})';
    addASingleWord(_name,_syns) {
        this.wordBook[_name]=_syns;
    }
}

class PerceivedQuery {
    constructor(id,InputQuery,QueryWordBook,QueryTaskDictionary) {
        this.QueryWordBook = this.QueryWordBook(QueryWordBook);
        this.QueryTaskDictionary = this.QueryTaskDictionary(QueryTaskDictionary);
        this.id = id;
        this.info = 'I show what I perceived based on the input';
        this.Raw = InputQuery;
        this.RawArray = this.Raw.split(' ');
        this.QueryObjectOfArraies = this.grasp_query(InputQuery);
        this.perceivedTask = this.grasp_task(this.QueryObjectOfArraies,this.QueryTaskDictionary);
    }
    QueryWordBook(QueryWordBook) {
        let result = '';
        if (QueryWordBook instanceof WordBook) {
            result = QueryWordBook.wordBook;
        }
        else {
            result = 'no proper Dictionary, as an instance of the WordBook class exist'
        }
        return result
    }
    QueryTaskDictionary(QueryTaskDictionary) {
        let result = '';
        if (QueryTaskDictionary instanceof TaskDictionary) {
            result = QueryTaskDictionary.dic;
        }
        else {
            result = 'no proper Dictionary, as an instance of the WordBook class exist'
        }
        return result
    }
    grasp_query(InputQuery) {
        let KeyInp = {};
        for (const key in this.QueryWordBook) {
            KeyInp[key] = [];
            if (this.QueryWordBook.hasOwnProperty(key)) {
                for (let index = 0; index < this.QueryWordBook[key].length; index++) {
                    for (let indexIn = 0; indexIn < this.RawArray.length; indexIn++) {
                        if (this.RawArray[indexIn]==this.QueryWordBook[key][index]) {
                            KeyInp[key][indexIn]=this.QueryWordBook[key][index];
                        }
                    }
                }   
            }
        }
        return KeyInp;
    }
    grasp_task(_QueryObjectOfArraies,_QueryTaskDictionary) {
        let rawComQueryLenght = this.RawArray.length;

        let _this= this;
        let perceiverTaskObject = {};
        for (const key in _QueryTaskDictionary) {
            let stEvlQueryLenght = _QueryTaskDictionary[key].stQuery.split(' ').length;
            let similarityOfLenght = null;
            if (stEvlQueryLenght>rawComQueryLenght) {
                similarityOfLenght=(rawComQueryLenght/stEvlQueryLenght)

            } else {
                similarityOfLenght=(stEvlQueryLenght/rawComQueryLenght)

            }
            let similaritymeasure = 0;
            if (_QueryTaskDictionary.hasOwnProperty(key)) {               
                for (const keyIn in _QueryObjectOfArraies) {
                    if (_QueryObjectOfArraies.hasOwnProperty(keyIn)) {
                            if (!(_QueryTaskDictionary[key].graspedstQueryObject[keyIn].filter(n=>n).length==0) &&_QueryTaskDictionary[key].graspedstQueryObject[keyIn].filter(n=>n).length == _QueryObjectOfArraies[keyIn].filter(n=>n).length) {
                                similaritymeasure += ((_QueryTaskDictionary[key].graspedstQueryObject[keyIn].filter(n=>n).length)/(_QueryTaskDictionary[key].stQuery.split(' ').length))    
                            }
                    }
                }                
            }
            perceiverTaskObject[key]=(similaritymeasure*similarityOfLenght).toFixed(2);
            // console.log("  perceiverTaskObject:  "+perceiverTaskObject[key]+"  similaritymeasure:  "+similaritymeasure+"  similarityOfLenght:  "+similarityOfLenght+ " _____")
        }
        return perceiverTaskObject       
    }
}


class SingleTask {
    constructor(_taskName,_taskFunction,_stQuery,_QueryWordBook) {
        
        this.taskName = _taskName;
        this.QueryWordBook = this.QueryWordBook(_QueryWordBook);
        this.stQuery = _stQuery;
        this.graspedstQueryObject = this.grasp_query(_stQuery)
        this.task = _taskFunction;
        

    }
    static Info = 
                    'I receive a name, a sample query as an standard query, and a function'
        QueryWordBook(_QueryWordBook) {
            let result = '';
            if (_QueryWordBook instanceof WordBook) {
                result = _QueryWordBook.wordBook;
            }
            else {
                result = 'no proper Dictionary, as an instance of the WordBook class exist'
            }
            return result
        }
        grasp_query(InputQuery) {
        let KeyInp = {};
        let stArr = this.stQuery.split(' ');
        for (const key in this.QueryWordBook) {
            KeyInp[key] = [];
            if (this.QueryWordBook.hasOwnProperty(key)) {
                for (let index = 0; index < this.QueryWordBook[key].length; index++) {
                    for (let indexIn = 0; indexIn < stArr.length; indexIn++) {
                        if (stArr[indexIn]==this.QueryWordBook[key][index]) {
                            KeyInp[key][indexIn]=this.QueryWordBook[key][index];
                        }
                    }
                }   
            }
        }
        return KeyInp;
    }
}


class TaskDictionary {
    constructor(_taskDicName) {
        this.dicName = _taskDicName;
        this.dic = {};
    }
    static info = 
                    'Add Single task to this class'
    addASingleTask(_singleTask) {
        this.dic[_singleTask.taskName]=_singleTask;

    }
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}



function probquery(samplequery) {
// var samplequery = 'add 3 and 3 then power 2';
var mainWB = new WordBook('WB1',{'create':['create','make','build'], 'number':[1,2,3,4,5,6,7,8,9,10], 'possibilities':['possibilities','worlds'],'add':['add','sum','+'],'power':['power','^','**']})
var taskD = new TaskDictionary('TD');
var Stask = new SingleTask('AP',function(a,b){return (a+b)^2},'5 + 6 ** 2',mainWB)
var Stask2 = new SingleTask('Ad',function(a,b){return (a+b)},'5 + 6',mainWB)
taskD.addASingleTask(Stask);
taskD.addASingleTask(Stask2);


var pq = new PerceivedQuery('testquery',samplequery,mainWB,taskD)
console.log(pq.perceivedTask)
// var arrout = JSON.stringify(pq.perceivedTask).replace(/"/g, "").replace(/{/g,"").replace(/}/g,"").split(',');
var str = syntaxHighlight(pq.perceivedTask);
var strPrint ="";
for (const key in pq.perceivedTask) {
    if (pq.perceivedTask.hasOwnProperty(key)) {
        const element = pq.perceivedTask[key];
        strPrint += '<br><span style="color:violet;font-size:small"><b>'+key+'</b></span>'+': <span style="color:gray;font-size:small">'+pq.perceivedTask[key]+'</span>';
        
    }
}

document.getElementById('resultQuery').innerHTML = strPrint;

}

