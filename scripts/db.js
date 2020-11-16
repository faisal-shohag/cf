

db.ref('coders').on('value', snap=>{
  var handles = '';
  snap.forEach(item=>{
    // console.log(item.val());
    handles += item.val().handle+';';
  })

  console.log(handles);
  $.get('https://codeforces.com/api/user.info?handles='+handles, function(){})
  .done(function(res){
    document.querySelector('.topThrees').innerHTML = '';
    document.querySelector('.alls').innerHTML = '';

    var byRating = res.result.slice(0);
byRating.sort(function(a,b) {
    return b.rating - a.rating;
});
    console.log(byRating)

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


  


    


// })

