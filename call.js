const nbaPlayer_endpoint = 'https://www.balldontlie.io/api/v1/players';
const nbaStats_endpoint = 'https://www.balldontlie.io/api/v1/season_averages';
const key = 'AIzaSyD1dLWzqlu6cULNUXQEgrhBvrY4Aa7hXpA';

function onVideo(json){
    console.log(json);
    const tessera = document.querySelector('#tessera');
    tessera.innerHTML = '';

    const length = json.pageInfo.resultsPerPage;

    for(let i=0; i<length ;i++) {
      const a = document.createElement('a');
      const div = document.createElement('div');
      div.classList.add('video');
      const br = document.createElement('br');
      const thumbnail = document.createElement('img');
      console.log(json.items[i].snippet.thumbnails.default.url);
      thumbnail.src = json.items[i].snippet.thumbnails.high.url;
     

      let url = "https://www.youtube.com/watch?v=" + json.items[i].id.videoId;
      console.log(url);
      a.href = url;
      a.textContent = json.items[i].snippet.title;
      div.appendChild(thumbnail);
      div.appendChild(a);
      tessera.appendChild(div);
    }
  
    

}

function onResponse(response){
    return response.json();
}


function getPosition(pos){
    let val = '';
    switch(pos){
        case 'C':
            val = 'Centro';
            break;
        case 'F':
            val = 'Ala';
            break;
        case 'G':
            val = 'Guardia';
            break;
        case 'P':
            val = 'Playmaker';
            break;
    }

    return val;
}


function OnNbaStats(json){
    console.log(json);
    const tessera = document.querySelector('#tessera');
    const stat = json.data[0];
    const stat_cont = document.createElement('article')
    const stat_cont_2 = document.createElement('article');

    const punti = stat.pts;
    const assist = stat.ast;
    const rimbalzi = stat.reb;

    stat_cont.textContent = 'Punti:'+ punti +'\n' +'Assist:'+ assist + '\n' +'Rimbalzi:' + rimbalzi;
    tessera.appendChild(stat_cont);

    const fga = stat.fga;
    const fgm = stat.fgm;
    const blk = stat.blk;

    stat_cont_2.textContent = 'Fga:'+ fga +'\n' +'Fgm:' + fgm + '\n' +'Blk:' + blk;
    tessera.appendChild(stat_cont_2);

}


function OnNbaPlayer(json){
    console.log(json);
    const player = json.data[0];
    const tessera = document.querySelector('#tessera');
    tessera.innerHTML = '';

    //creo un titolo nome e altezza del giocatore
    const name = document.createElement('h1');
    name.textContent = player.first_name + ' ' + player.last_name;

    const altezza = player.height_feet + "'" + player.height_inches + "\"";
    const ruolo = getPosition(player.position);
    const ar = altezza + " " + ruolo;
    const artic = document.createElement('atricle');
    artic.textContent = ar;
    tessera.appendChild(name);
    tessera.appendChild(artic);


    stat_request= nbaStats_endpoint + '?player_ids[]=' + player.id;
    console.log(stat_request);
    fetch(stat_request).then(onResponse).then(OnNbaStats);

    


}



function search(event){

    event.preventDefault();

    const content = document.querySelector('#content').value;

    if(content){
        const text = encodeURIComponent(content);
        console.log('Eseguo ricerca elementi riguardanti: ' + text);

        const tipo = document.querySelector('#tipo').value;
	    console.log('Ricerco elementi di tipo: ' +tipo);

        switch(tipo){
            case 'giocatore':
            nba_request= nbaPlayer_endpoint + '?search=' + text ;
            fetch(nba_request).then(onResponse).then(OnNbaPlayer);
            break;
            case 'video':
                rest_url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + key +'&type=video&q=' + text;
                fetch(rest_url).then(onResponse).then(onVideo);
            break;




         }      


    }else{
        alert('Inserisci il contenuto');
    }

}








const form = document.querySelector('#search_content');
form.addEventListener('submit',search);
