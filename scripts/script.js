// console.log(localStorage.getItem('rank'));
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
      
      var lastContestInfo = {};
      var totalContests;

     $(function(){
       $.get('https://codeforces.com/api/user.rating?handle='+localStorage.getItem('handle'), function(){})
       .done(function(data){
         console.log(data);
          //console.log(data.result[data.result.length-1])
          totalContests = data.result.length;
          const lastRating = data.result[data.result.length-1];
          lastContestInfo = lastRating;
          var d = new Date(lastRating.ratingUpdateTimeSeconds*1000)
          console.log(d);
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



//update profile pic when user log in


