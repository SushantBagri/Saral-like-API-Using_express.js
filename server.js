const express = require('express');
const app=express();
const fs=require('fs');
const port=8000;

app.use(express.json());
app.use(express.text())

const data=fs.readFileSync('availableCourses.json');
const jsonData=JSON.parse(data);

//ENDPONTS

//for all courses
app.get('/home',(req,res)=>{
    console.log('before')
    res.send(jsonData)
})



app.get('/courses',(req,res)=>{
    let mainArr=[]
    for(let i of jsonData){
        let Arr={}
        Arr['id']=i.id
        Arr['name']=i.name
        Arr['description']=i.description
        mainArr.push(Arr)
    }
    console.log('success')
    res.send(mainArr)
})



app.get('/:id',(req,res)=>{
    res.send(jsonData[req.params.id-1])
})



app.get('/:id/courses',(req,res)=>{
    let id=req.params.id;
    let mainArr=[jsonData[id-1].id]
    for(let i of jsonData[id-1].submission){
        let Arr={}
        Arr['courseID']=i.courseid;
        Arr['name']=i.name;
        Arr['description']=i.description
        mainArr.push(Arr)
    }
    res.send(mainArr)
})


// for adding new course


app.post('/create',(req,res)=>{
    let Arr={}
    Arr.id=jsonData.length+1;
    Arr.name=req.body.name;
    Arr.description=req.body.description;
    jsonData.push(Arr);

    fs.writeFileSync('availableCourses.json',JSON.stringify(jsonData,null,4))
    res.send(`<h1> Your input is recorded</h1>`)
})



//comments

app.get('/all/comm',(req,res)=>{
    let commArr=[];
    for(let i of jsonData){
        for(j of i.submission){
            for(k of j.usersummision){
                let comm={}
                comm['id']=k.id
                comm['username']=k.username
                comm['comment']=k.usersubmissions
                commArr.push(comm)
            }
        }
    }
    res.send(commArr)
})



app.get('/:id/comments',(req,res)=>{
    let id=req.params.id;
    let commArr=[];
    for(let i of jsonData[id-1].submission){
        for(k of i.usersummision){
            let comm={}
            comm['id']=k.id
            comm['username']=k.username
            comm['comment']=k.usersubmissions
            commArr.push(comm)
        }
    }
    res.send(commArr)
})



app.get('/:id/:courseid/comments',(req,res)=>{
    let id=req.params.id;
    let courseId=req.params.courseid;
    let mainArr=[]
    for(let i of jsonData[id-1].submission[courseId-1].usersummision){
            let comm={}
            comm['id']=i.id
            comm['username']=i.username
            comm['comment']=i.usersubmissions
            mainArr.push(comm)
    }
    res.send(mainArr);

})


//for adding new comment

app.post('/:id/:courseid/comment',(req,res)=>{
    let id=req.params.id;
    let courseid=req.params.courseid;

    let mainArr=jsonData[id-1].submission[courseid-1].usersummision;
    let dataArr={};

    dataArr['id']=parseInt(id);
    dataArr['courseid']=parseInt(courseid);
    dataArr['username']=req.body.username;
    dataArr['usersubmissions']=req.body.usersubmissions;
    mainArr.push(dataArr);

    jsonData[id-1].submission[courseid-1].usersummision=mainArr;
    fs.writeFileSync('availableCourses.json',JSON.stringify(jsonData,null,4));

    res.send(`<h1>your comment is recorded</h1>`);
})



//listening the port
app.listen(port,()=>{
    console.log(`app is running at port ${port}`)
})