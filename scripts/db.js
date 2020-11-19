
db.ref('coders').on('value', snap=>{
  var handles = '';
  snap.forEach(item=>{
    // console.log(item.val());
    handles += item.val().handle+';';
  })

  //console.log(handles);
  $.get('https://codeforces.com/api/user.info?handles='+handles, function(){})
  .done(function(res){
    document.querySelector('.topThrees').innerHTML = '';
    document.querySelector('.alls').innerHTML = '';

    var byRating = res.result.slice(0);
byRating.sort(function(a,b) {
    return b.rating - a.rating;
});
    //console.log(byRating)

    var k=0;

    byRating.forEach(data=>{
     k++;
  if(k<4){
      var html = `
      <div class="item" id="${data.handle}">
        <div class="avatar" style="border:3px solid ${colorPlatte[data.rank]};"><img src="${data.avatar}"></div>
        <div class="info">
          <div class="handle" style="color: ${colorPlatte[data.rank]};">${data.handle}</div>
          <div class="rank" style="color: ${colorPlatte[data.rank]};">${data.rank}(${data.rating})</div>
        </div>
      </div>
      
      `
      document.querySelector('.topThrees').innerHTML += html;
  }
    })


    byRating.forEach(data=>{
      var html = `
      <div class="item" id="${data.handle}">
        <div class="avatar" style="border:3px solid ${colorPlatte[data.rank]};"><img src="${data.avatar}"></div>
        <div class="info">
          <div class="handle" style="color: ${colorPlatte[data.rank]};">${data.handle}</div>
          <div class="rank" style="color: ${colorPlatte[data.rank]};">${data.rank}(${data.rating})</div>
        </div>
      </div>
      
      `
      document.querySelector('.alls').innerHTML += html;
  
    });

    $('.item').click(function(){
      $('.problem-loading').show();
      handle = $(this)[0].id;
      //console.log(handle);
      $.get('https://codeforces.com/api/user.info?handles='+handle, function(){})
      .done(function(res){
       // var lastContestInfo1 = {};
        var totalContests1;
  
  $(function(){
         $.get('https://codeforces.com/api/user.rating?handle='+handle, function(){})
         .done(function(data){
            //console.log(data);
            //console.log(data.result[data.result.length-1])
            totalContests1 = data.result.length-1;
            const lastRating = data.result[data.result.length-1];
          
          $('.problem-loading').hide();
  
          Swal.fire({
              html: `
              <div class="profile-modal">
              <center><div class="avatar"></div>
              <div class="username"><span style="color: ${colorPlatte[res.result[0].rank]}; font-size: 20px;">${res.result[0].handle}<br /><span style="font-size: 17px;"> ${res.result[0].rank}<b>(<span class="Count">${res.result[0].rating}</span>)</b></span></span></div>
              <div><b>Last Contest:</b> ${lastRating.contestName}<br /> 
              <b>Total Contests: <strong style="color: var(--danger)">${totalContests1+1}</strong><br /> 
              <b>Max Rating: <strong style="color: var(--danger)">${res.result[0].maxRating}</strong>
                   
              </div>
              <div>
              <a target="blank" href="https://codeforces.com/profile/${res.result[0].handle}">View Profile</a>
              </div>
              <div>
              <a target="blank" href="https://codeforces.com/submissions/${res.result[0].handle}">View Submissions</a>
              </div>
              </center>
          
              </div>
              
              `,
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
    })
  });
})


  
$(function () {
  $.get('https://codeforces.com/api/contest.list?gym=false', function () { })
    .done(function (res) {
      //console.log(res);
      var data = res.result;
      var updateContest;
      var nextContest;
      for (i = 0; i < 20; ++i) {
if (data[i].phase === 'FINISHED' && (data[i].name.includes('Codeforces Round') || data[i].name.includes('Educational Codeforces Round') ||   data[i].name.includes('Codeforces Global Round'))) {
            updateContest = data[i];
            nextContest = data[i+1];
            break;
        }
      }

      //console.log(updateContest);

      
//if already updated

db.ref('ratingChanges').on('value', snap=>{
  updateStatus = false;
  snap.forEach(item=>{
    if(item.val().contestId ===updateContest.id || item.val().contestId === nextContest.id){
      updateStatus = true;
    }
  });

if(!updateStatus){
  $(function(){
    $.get('https://codeforces.com/api/contest.ratingChanges?contestId='+ updateContest.id, function(){})
    .done(res=>{
      //console.log(res.result);
      
      if(res.result.length>1){
       // console.log('Rating Changes Available');
        $('#ratingStatus').html(`<div class="ratingStatus">Rating Changes available for <b style="color: var(--warning)">${updateContest.name}</b>
        <div class="update-menu"><div id="${updateContest.id}" class="update btn red">Update</div> <div class="next btn primary">Next</div></div>
        </div>
        `)
      }else{
        $('#ratingStatus').html(`<div class="ratingStatus">Rating Changes coming soon for <b style="color: var(--warning)">${updateContest.name}</b></div>`)
      }


      $('.next').click(function(){
        $(function(){
          $.get('https://codeforces.com/api/contest.ratingChanges?contestId='+ updateContest.id, function(){})
          .done(res=>{
           // console.log(res.result);
            
            if(res.result.length>1){
              //console.log('Rating Changes Available');
              $('#ratingStatus').html(`<div class="ratingStatus">Rating Changes available for <b style="color: var(--warning)">${nextContest.name}</b>
              <div id="${nextContest.id}" class="update btn red">Update</div>
              </div>
              
              `)
            }else{
              $('#ratingStatus').html(`<div class="ratingStatus">Rating Changes coming soon for <b style="color: var(--warning)">${nextContest.name}</b></div>`)
            }

            $('.update').click(function(){
              console.log()
              updateRatingChanges($(this)[0].id);
            })
          })
          
        })
      })

      $('.update').click(function(){
        console.log()
        updateRatingChanges($(this)[0].id);
      });
    })
  })

}

})
     
    })
    .fail(function () {
      $('.status').html('There was an error when fething data form codeforces! <br> Please Reload!')
    })
});


function updateRatingChanges(id){
  $('.problem-loading').show();
//console.log(id);
id = parseInt(id);

db.ref('coders').on('value', snap=> {
  var usernames = [];
  snap.forEach(item=> {
    //console.log(item.val());
    usernames.push(item.val().handle);
  })

  $(document).ready(function(){
    $('.modal').modal();
    $('#updateModal').modal('open');
    })

  //console.log(usernames);
  let i=-1;
  var contestData = [];
  var y = setInterval(function() {
  i++;
  fetch('https://codeforces.com/api/user.rating?handle='+usernames[i])
    .then(response=>response.json())
    .then(data=>{
      $('.problem-loading').hide();
    $('.updateCount').html(` (${i}/${usernames.length-1})`)

      //console.log(data);
      var lastContest = data.result[data.result.length-1];
      
      //console.log(usernames[i]);
      if(lastContest.contestId === id && lastContest.contestId != undefined){
        //console.log('Found!');
        //console.log(lastContest.contestName);
        contestData.push(lastContest);
        $('.updating').html(`Getting Data for <b><span style="color:${colorByRating(lastContest.newRating)}">${lastContest.handle}</span></b><br />
        Status: <span style="color:var(--success)">Participated!</span>
        `)
      }else{
        $('.updating').html(`Getting Data for <b><span style="color:${colorByRating(lastContest.newRating)}">${lastContest.handle}</span></b><br />
        Status: <span style="color:var(--danger)">Not participated!</span>
        `)
      }
    })

    if(i === usernames.length-1) {
      //console.log('Update finished!');
      $('.updating').hide();
      //console.log(contestData);
      if(contestData.length>1){
        db.ref('ratingChanges').set(contestData);
        $('.finishedStatus').html(`<span style="color:var(--success)">Update Completed!</span>
        `)
        clearInterval(y);
      } 
      else{
        console.log('No one participated in this contest...');
        $('.finishedStatus').html(`<span style="color:var(--danger)">Update Failed! No one participated in this contest...</span>
        `)
        clearInterval(y);
      }
     

    }

  }, 2000);

})


}

//Showing Rating changes 
db.ref('ratingChanges').on('value', snap=>{
  document.querySelector('.ratingChanges').innerHTML = '';
  var contestName = '';
  snap.forEach(item=>{
    //console.log(item.val());
    contestName = item.val().contestName;
    var ratingChanges = item.val().newRating - item.val().oldRating;

    if(ratingChanges>=0){
      var html = `
    <div class="item" id="${item.val().handle}">
        <div class="info">
          <div class="handle" style="color:${colorByRating(item.val().newRating)};">${item.val().handle}(${item.val().newRating})</div>
          <div class="rank" style="color:"><span style="color: var(--success);">+${ratingChanges}</span> | <i>Rank: ${item.val().rank}</i></div>
        </div>
      </div>
    `

    }else {
      var html = `
      <div class="item"id="${item.val().handle}">
          <div class="info">
            <div class="handle" style="color:${colorByRating(item.val().newRating)};">${item.val().handle}(${item.val().newRating})</div>
            <div class="rank"><span style="color: var(--danger);">${ratingChanges}</span> | <i>Rank: ${item.val().rank}</i></div>
          </div>
        </div>
      `
    }

    document.querySelector('.ratingChanges').innerHTML += html;
    
  })

  $('#contestName').text(contestName);
})



//Color by Rating
function colorByRating(rating){
if(rating>=2200 && rating<= 2299) return 'var(--orange)';
else if(rating>=1900 && rating<= 1899) return '#a0a';
else if(rating>=1600 && rating<=1899) return 'var(--primary)';
else if(rating>=1400 && rating<=1599) return 'rgb(3,168,158);'
else if(rating>=1200 && rating<=1399) return 'var(--success)';
else return 'var(--gray)';
}

