// console.log(localStorage.getItem('rank'));
localStorage.setItem('mode', 'dark');
$('.problem-loading').show();
M.toast({html: 'Website is under maintenance!', classes: 'red'})
// localStorage.removeItem('autoState');

$(document).ready(function(){
  $('.modal').modal();
});

var colorPlatte = {
 'newbie': 'var(--gray)',
 'pupil' : 'var(--success)',
 'specialist': 'rgb(3,168,158);',
 'expert' : 'var(--primary)',
 'candidate master': 'rgb(170,0,170);',
 'master': 'rgb(255,140,0);',
}

var monthNum = {
  '1':'Jan',
  '2':'Feb',
  '3':'Mar',
  '4':'Apr',
  '5':'May',
  '6':'Jun',
  '7':'Jul',
  '8':'Aug',
  '9':'Sep',
  '10':'Oct',
  '11':'Nov',
  '12':'Dec'
}

//console.log(colorPlatte['newbie'])

$('.login').click(function(){
  var temp = '';
  var rank = '';
    Swal.fire({
        title: 'Submit your Codeforces Username/Handle',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Look up',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return fetch(`https://codeforces.com/api/user.info?handles=${login}`)
            .then(response => {
                console.log(response)
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result)
          temp = result.value.result[0].handle;
          rank = result.value.result[0].rank;
          Swal.fire({
            confirmButtonText: 'Yes',
            showCancelButton: true,
            title: `${result.value.result[0].handle}(${result.value.result[0].rank})`,
            html: `<small>from ${result.value.result[0].city}, ${result.value.result[0].country}</small> <br /> is it you?`,
            imageUrl: result.value.result[0].titlePhoto
          }).then((result) =>{
              if(result.isConfirmed){
                  console.log('Saved!');
                  localStorage.setItem('handle', temp);
                  localStorage.setItem('rank', rank);
                  window.location.reload();
              }else{
                  window.location.reload();
              }
          })
        }
      });
});

if(localStorage.getItem('handle') === null){
  $('.login').click();
  $('.user-top-info').hide(); 
}else{
 


  $('.login').hide();
  $(function(){

   

    $.get('https://codeforces.com/api/user.info?handles='+localStorage.getItem('handle'), function(){})
    .done(function(res){

      if(localStorage.getItem('autoState') === 'On' || localStorage.getItem('autoState') === null){
      setTimeout(function(){
        $('.prblm-sg').click();
        }, 5000);
      }

      //console.log(res.result[0]);
      $('.user-top-info .avatar').css('border', '3px solid '+colorPlatte[res.result[0].rank]);
      $('.user-top-info .avatar').html(`<img src="https:${res.result[0].avatar}" />`);
      $('.username').html(`<span style="color: ${colorPlatte[res.result[0].rank]};">${res.result[0].handle}<b>(<span class="Count">${res.result[0].rating}</span>)</b></span>`);
      $('.you').html(`<span style="color: ${colorPlatte[res.result[0].rank]};">You(${res.result[0].handle})</span>`)
      var lastContestInfo = {};
      var totalContests;

     $(function(){
       $.get('https://codeforces.com/api/user.rating?handle='+localStorage.getItem('handle'), function(){})
       .done(function(data){
         //console.log(data);
          //console.log(data.result[data.result.length-1])
          totalContests = data.result.length;
          const lastRating = data.result[data.result.length-1];
          lastContestInfo = lastRating;
          var d = new Date(lastRating.ratingUpdateTimeSeconds*1000)
          //console.log(d);
          d = d.toString().split(' ');
          let date = d[2], month = d[1], year = d[3];
        if(lastRating.newRating - lastRating.oldRating < 0){
          $('.ratingChanged').html(`<span style="color: red;">${lastRating.newRating - lastRating.oldRating}</span> <span style="color: gray; font-size: 10px;">(${date + ' ' + month +' '+ year})</span>`);
        }else{
          $('.ratingChanged').html(`<span style="color: var(--success);">+${lastRating.newRating - lastRating.oldRating}</span> <span style="color: gray; font-size: 10px;">(${date + ' ' + month +' '+ year})</span>`);
        }
          
       })


     })

    $('.user-top-info').click(function(){
  Swal.fire({
    html: `
    <div class="profile-modal">
    <center><div class="avatar"></div>
    <div class="username"><span style="color: ${colorPlatte[res.result[0].rank]}; font-size: 20px;">${res.result[0].handle}<br /><span style="font-size: 17px;"> ${res.result[0].rank}<b>(<span class="Count">${res.result[0].rating}</span>)</b></span></span></div>
    <div><b>Last Contest:</b> ${lastContestInfo.contestName}<br /> 
    <b>Total Contests: <strong style="color: var(--danger)">${totalContests}</strong><br /> 
    <b>Max Rating: <strong style="color: var(--danger)">${res.result[0].maxRating}</strong>
         
    </div>
    <div>
    <a target="blank" href="https://codeforces.com/profile/${res.result[0].handle}">View on CF</a>
    </div>
    </center>

    </div>
    
    `,
    confirmButtonText: 'LogOut/Change username',
    showCancelButton: true,
    cancelButtonText: 'Close'
  }).then((res)=>{
    if(res.isConfirmed){
      localStorage.removeItem('handle');
      window.location.reload();
    }
  })

  $('.profile-modal .avatar').html(`<img src="https:${res.result[0].avatar}" />`);
$('.profile-modal .avatar').css('border', '3px solid '+colorPlatte[res.result[0].rank]);



$('.Count').each(function () {
  var $this = $(this);
  jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
    duration: 2000,
    easing: 'swing',
    step: function () {
      $this.text(Math.ceil(this.Counter));
    }
  });
});




})



    })
  })


}

//Problem Suggestion

$('.prblm-sg').click(function(){
  $('.problem-loading').show();

  var rank = localStorage.getItem('rank');
  if(rank === null) rank = 'pupil';
  var start = 0;
  if (rank === "expert") start = Math.floor(Math.random() * 1301) + 1200;
        else if (rank === "specialist") start = Math.floor(Math.random() * 1200) + 700;
        else if (rank === "pupil") start = Math.floor(Math.random() * 800) + 500;
        else if (rank === "newbie") start = Math.floor(Math.random() * 800) + 10;
        else start = Math.floor(Math.random() * 2500) + 1600;
        if (start > 2500) {
            start = Math.floor(Math.random() * 5000) + 300;
        }
  var end = start+1;
  
   $(function(){
     $.get('https://mah20.pythonanywhere.com/cf/get_list/start=' + start + 'end=' + end, function(){})
     .done(function(res){
       var data = Object.entries(res);
       $('.problem-loading').hide();
       //console.log(data);
        var solvers = (data[data.length-1][1].solvers).join(',');
        var cat = (data[data.length-1][1].link).split('/');
            cat = cat[cat.length-1];
       Swal.fire({
        html: `
        <div class="toggle-sg" style="float: right; color: var(--primary);"></div>
        <div class="ttl">Problem for you!</div>
        <div class="problemName">${cat}. ${data[data.length-1][0]}</div>
        <a target="blank" href="${data[data.length-1][1].link}"><div class="btn green">Try It!</div></a>
        <div class="solver">Solvers(${data[data.length-1][1].solvers.length}):<br/>
        ${solvers}
        </div>

        <small>This API from Mahmudul Alam</small>
        
        `,
        showCancelButton: true,
        confirmButtonText: 'Next',
        cancelButtonText: 'Close'
      }).then((res)=>{
        if(res.isConfirmed){
          $('.prblm-sg').click();
        }
      });
    
      
      if(localStorage.getItem('autoState') === 'Off'){
        $('.toggle-sg').text('Turn On Auto Suggestion');
      }else{ if(localStorage.getItem('autoState') === 'On' || localStorage.getItem('autoState') === null)
        $('.toggle-sg').text('Turn Off Auto Suggestion');
      }

      $('.toggle-sg').click(function(){
        if(localStorage.getItem('autoState') === 'Off' || localStorage.getItem('autoState') === null){
          localStorage.setItem('autoState', 'On');
          //$('.toggle-sg').text('Turn On Auto Suggestion');
          //console.log(localStorage.getItem('autoState'));
          window.location.reload();
        }else{
          localStorage.setItem('autoState', 'Off');
          //$('.toggle-sg').text('Turn Off Auto Suggestion');
          console.log(localStorage.getItem('autoState'));
          window.location.reload();
        }
        
      })

     })
   })
})



//console.log(localStorage.getItem('handle'))
//update profile pic when user log in
//TIME_LIMIT_EXCEEDED
//WRONG_ANSWER
//OK
//"COMPILATION_ERROR"
//"RUNTIME_ERROR"
if(localStorage.getItem('handle') === null) $('.me').hide();
$(function(){
  $.get('https://codeforces.com/api/user.status?handle='+localStorage.getItem('handle'), function(){})
  .done(function(res){
    //console.log(res);
    $('.total_sub').html(`Total Submissions: <span class="num">${res.result.length}</span>`);
    let AC=0, WA=0, TLE=0, CE=0,RE=0,ME=0;
    let solvedTotal = new Set();
    let ac=new Set(), wa=new Set(), tle=new Set(), ce=new Set(), re=new Set(), me= new Set();
    res.result.forEach(item=>{
      if(item.verdict==="OK"){
        solvedTotal.add(item.problem.name);
        ac.add(item.problem);
        AC++;
      }else if(item.verdict==="WRONG_ANSWER"){
        wa.add(item.problem);
        WA++;
      }else if(item.verdict==="TIME_LIMIT_EXCEEDED"){
        tle.add(item.problem);
        TLE++;
      }else if(item.verdict==="COMPILATION_ERROR"){
        ce.add(item.problem);
        CE++;
      }else if(item.verdict==="RUNTIME_ERROR"){
        re.add(item.problem);
        RE++;
      }else if(item.verdict==="MEMORY_LIMIT_EXCEEDED"){
        me.add(item.problem);
        ME++;
      }
    })
    
    $('.solved').html(`Solved: <span class="num">${solvedTotal.size}</span>`)
    //console.log(solvedTotal.size)
   
   $('.problemStat').html(`
   <div class="ac box1" id="ac" style="font-size: 20px; border-top: 2px solid var(--success); color:var(--success)"><span style="font-size: 12px; pading-top: -5px; padding:0;" >AC</span><br>${AC}</div>
   <div class="wa box1" id="wa" style="font-size: 20px; border-top: 2px solid var(--danger); color:var(--danger)"><span style="font-size: 12px; pading-top: -5px; padding:0;">WA</span><br>${WA}</div>
   <div class="tle box1" id="tle" style="font-size: 20px; border-top: 2px solid var(--warning); color:var(--warning)"><span style="font-size: 12px; pading-top: -5px; padding:0;">TLE</span><br>${TLE}</div>
   <div class="ce box1" id="ce" style="font-size: 20px; border-top: 2px solid var(--pink); color:var(--pink)"><span style="font-size: 12px; pading-top: -5px; padding:0;">CE</span><br>${CE}</div>
   <div class="mle box1" id="mle" style="font-size: 20px; border-top: 2px solid var(--info); color:var(--info)"><span style="font-size: 12px; pading-top: -5px; padding:0;">MLE</span><br>${ME}</div>
   <div class="re box1" id="re" style="font-size: 20px; border-top: 2px solid var(--teal); color:var(--teal)"><span style="font-size: 12px; pading-top: -5px; padding:0;">RE</span><br>${RE}</div>
   `)

   $('.box1').click(function(){
    $('.problem-loading').show();
    $(document).ready(function(){
      $('#myProblems').modal();
      $('#myProblems').modal('open'); 
   });
   
   let id=$(this)[0].id;
   $('.itemTitle').html(`${id.toUpperCase()}<small>(max.100)</small>`);
   document.querySelector('.problemsList').innerHTML='';
   var p=0;
   for(let prob of getDataList(id)){
       //console.log(prob);
       p++;
       
      
       let tags = prob.tags.join(', ');
       let link = 'https://codeforces.com/problemset/problem/'+prob.contest+'/'+prob.index;
       let probHtml = `
       <a target="blank" href="${link}"><div class="probItem">
       <div class="logo" style="background: ${getColorByIndex(prob.index)}">${prob.index}</div>
       <div class="probOt">
       <div class="probName">${prob.index}. ${prob.name}</div>
       <div class="tags">[${tags}]</div>
       </div>
       </div></a>
       `
    document.querySelector('.problemsList').innerHTML+=probHtml;
    if(p===101) break;
   }

   $('.problem-loading').hide();
   

   });


   function getDataList(dataName){
     if(dataName==='ac') return ac;
     else if(dataName==='wa') return wa;
     else if(dataName==='tle') return tle;
     else if(dataName==='ce') return ce;
     else if(dataName==='mle') return me;
     else if(dataName==='re') return re;
   }


  })
})


function getColorByIndex(index){
  if(index==='A') return 'var(--success)';
  else if(index==='B') return 'rgb(3,168,158)';
  else if (index === 'C') return 'var(--primary)';
  else if (index === 'D') return 'var(--purple)';
  else if (index === 'E') return 'var(--warning)';
  else if (index === 'F') return 'var(--danger)';
  else return 'red';
}
