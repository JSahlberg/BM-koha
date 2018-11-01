$(document).ready(function() {

// OBS! Specifikt för testdatabasen
//$('h1#logo a').css('overflow','visible');
//$('h1#logo a').text('Testdatabas');
$('<div id="testd"><span>TESTDATABAS</span></div>').insertBefore('#header');
$('#testd span').fadeIn(1000);
// Slut för specifikt för testdatabasen



// *************************************************************************************
// Fjärrlåneknapp för att begränsa till endast sökning på fjärrlån som exemplartyp
// ver 1

function fjarrlancb(where) {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "checkbox");
    x.setAttribute("id", "flcb");
    x.setAttribute("value", "FJARRLAN");
    $(where).append(x);
    $('#flcb').parent().append('<label for="FJARRLAN"> Endast fjärrlån</label>');
}

$('#cat-search-block').each(function() {

  fjarrlancb(this);

});

$('#cat-search-block .submit').on('click', function(event) {

  event.preventDefault();

  if ($('#flcb').is(':checked')) {
  var s = $('#search-form').val();

  window.location.href = 'https://' + window.location.hostname + '/cgi-bin/koha/catalogue/search.pl?idx=kw&q=' + s + '&sort_by=pubdate_dsc&limit=itype:FJARRLAN';

  } else {
    $('#cat-search-block').trigger('submit');
  };

});




// *************************************************************************************
// Knappar för Kopiera och Återlämna bredvid streckkod på exemplarsidan
// ver 1.2

if ($('#catalog_detail').length) {

  $('#holdings_table tbody tr td:nth-child(9), #otherholdings_table tbody tr td:nth-child(9)').each(function() {

  $(this).append('<br /><a href="#" class="btn btn-default btn-xs bcopy" data-toggle="tooltip" title="Kopiera"><i class="fa fa-copy"></i><a href="#" class="btn btn-default btn-xs breturn" data-toggle="tooltip" title="Återlämna"><i class="fa fa-sign-in"></i></a>');

  });

// Kopiera

  $('.bcopy').on('click', function() {
    var bc = $(this).siblings('a:first').text();
    $('#search-form').val(bc);
    $('#search-form').select();
    document.execCommand("copy");
    $('#search-form').val('');
  });

// Återlämna

  $('.breturn').on('click', function() {

    var bc = $(this).siblings('a:first').text();
 
    if(confirm("Är du säker på att du vill återlämna detta exemplaret? \n\r\n\r" + bc)){
      window.location.href = 'https://' + window.location.hostname + '/cgi-bin/koha/circ/returns.pl?barcode=' + bc;
    }
    else{
      return false;
    }
  });
};




// *************************************************************************************
// Reservationsrutan - Grönmarkerad knapp, räcker att man trycker ENTER så godkänner man 
// och skriver ut kvitto. Trycker man på ESC så stänger man rutan helt och ignorerar.
// ver 1.1

if ($('#hold-found2').length) {

  $(document).keypress(function(e) {
    e.preventDefault();
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
      $('button.btn.btn-default.print').trigger('click');
    };
    if(code == 27) {
      $('button.btn.btn-danger.deny').trigger('click');
    }
  });

};




// *************************************************************************************
// Visa antal exemplar på flikarna för både egna och andra bibliotek
// ver 1

$('#holdings').each(function() {

  var nrex = $('#holdings tbody tr').length;
  var nroex = $('#otherholdings tbody tr').length;  

  $('a[href="#holdings"]').append('<span> (' + nrex + ')</span>');

  $('a[href="#otherholdings"]').append('<span> (' + nroex + ')</span>');
  
});




// *************************************************************************************
// Ändrar automatiskt till itemtype "BARNBOK" om man skriver in Hcf, Hcg eller något med litet u 
// i Full call number vid exemplarinläggning eller redigering.
// ver 1.1


$('#subfield952o input:first').change(function() {

  if ($(this).val().indexOf('Hcf') > -1 | $(this).val().indexOf('Hcg') > -1 | $(this).val().startsWith('u',0) | $(this).val().indexOf(',u') > -1 ) {

    $('select[id^="tag_952_subfield_y"]').select2('val','BARNBOK');

  };

});


/*
$('input[id^="tag_952_subfield_o"]').each(function() {

  if ($(this).val()) {

    if ($(this).val().indexOf('Hcf') > -1 | $(this).val().indexOf('Hcg') > -1 | $(this).val().startsWith('u',0)) {

      $('select[id^="tag_952_subfield_y"]').select2('val','BARNBOK');

    }

  }

});
*/


// *************************************************************************************
//Döljer onödiga fält vid exemplarredigering/registrering 

var0 = $('body').is("#cat_additem"); 

if (var0 !=0) { 

          $('span:contains("Materials specified (bound volume or other part)")').parent().parent().parent().hide(); 
          $('span:contains("Use restrictions")').parent().parent().parent().hide(); 
          $('span:contains("Uniform Resource Identifier")').parent().parent().parent().hide(); 
          $('span:contains("Price effective from")').parent().parent().parent().hide(); 
          $('span:contains("Price effective from")').parent().parent().parent().hide(); 
          $('span:contains("Price effective from")').parent().parent().parent().hide(); 
          $('span:contains("Copy number")').parent().parent().parent().hide(); 
          $('span:contains("Shelving control number")').parent().parent().parent().hide(); 
          $('span:contains("Date last checked out")').parent().parent().parent().hide(); 
          $('span:contains("Total Checkouts")').parent().parent().parent().hide(); 
          $('span:contains("Total Renewals")').parent().parent().parent().hide(); 
          $('span:contains("Total Holds")').parent().parent().parent().hide(); 
          $('span:contains("Checked out")').parent().parent().parent().hide(); 
          $('span:contains("Date last seen")').parent().parent().parent().hide(); 
          $('span:contains("Coded location qualifier")').parent().parent().parent().hide(); 
} 


// *************************************************************************************
// Stor bokstav i början på alla namn och adresser på låntagaranmälan och redigering 
// ver 1.1

jQuery.fn.capitalize = function() {
    $(this[0]).keyup(function(event) {
        var box = event.target;
        var txt = $(this).val();
        var stringStart = box.selectionStart;
        var stringEnd = box.selectionEnd;
        $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function($word) {
            return $word.toUpperCase();
        }));
        box.setSelectionRange(stringStart , stringEnd);
    });

   return this;
}

$('#surname, #firstname, #address, #address2, #city, #country, #B_address, #B_address2, #B_city, #B_country').addClass('capitalizer');

$('.capitalizer').on('input', function() {
  $(this).capitalize();
});



// *************************************************************************************
// Endast småbokstäver i e-postfält
// ver 1

jQuery.fn.decapitalize = function() {
    $(this[0]).keyup(function(event) {
        var box = event.target;
        var txt = $(this).val();
        var stringStart = box.selectionStart;
        var stringEnd = box.selectionEnd;
        $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function($word) {
            return $word.toLowerCase();
        }));
        box.setSelectionRange(stringStart , stringEnd);
    });

   return this;
}

$('#email').addClass('decapitalizer');

$('.decapitalizer').on('input', function() {
  $(this).decapitalize();
});



// *************************************************************************************
// Meddelanden på låntagarsidan går nu redigera så man slipper skriva en nya varje gång.
// ver 1

$('<a class="editmsg btn btn-link btn-sm" href="#"><i class="fa fa-edit"></i>Ändra</a>').insertAfter('#messages .circ-hlt');

$('.editmsg').on('click', function() {

  var delmsglink = $(this).next().attr('href');
  var msg =  $(this).closest('li').find('span.circ-hlt i').text().slice(1,-1);
  localStorage.setItem('editmsg', msg);

  $('#addnewmessageLabel').trigger('click');

  $('#borrower_message').val(msg);

  $('.modal-footer button.btn.btn-default.approve').on('click', function (event) {
    event.preventDefault();
    $.get('https://' + window.location.hostname + delmsglink).done(function(datan) {
      $('form#message_form').trigger('submit');
    });
  });

  $('.modal-footer button.btn.btn-default.deny.cancel').on('click', function () {
    $('#borrower_message').val(msg);
  });
});



// *************************************************************************************
// Markera innehållet i Streckkodsrutan när man klickar i rutan.
// Förenklar så man kan dra streckkoden direkt när man ställer sig i rutan.
// ver 1

$('input[id^="tag_952_subfield_p"]').each(function() {
  $(this).addClass('bcselect');
});

$('.bcselect').on('focus', function(){
  $(this).select(); 
});

$('input[id^="tag_952_subfield_p"]').on('click', function() {
  if (!$('input[id^="tag_952_subfield_p"]').val() > -1) {
    $(this).select();
  };
});



// *************************************************************************************
// Få med skickande bibliotek på kvittoutskrift
// ver 1

var lib = localStorage.getItem('loggedinbranch');

$('.loggedinbranch').text(lib);



// *************************************************************************************
// Antal reservationer i kö vid utlån
// ver 1.1

$('#circ_needsconfirmation').each(function() { 
  var search = sessionStorage.getItem('lastbarcode');

  if ($('#circ_needsconfirmation ul li').text().indexOf('Efterfrågat') > -1 | $('#circ_needsconfirmation ul li').text().indexOf('High demand') > -1) {

      $('#circ_needsconfirmation ul').append('<li>Antal reservationer i kö:\t <span id="antal"><i>Hämtar...</i></span></li>');

    $.get('https://' + window.location.hostname + '/cgi-bin/koha/catalogue/search.pl?q=' + search).done(function(datan) {

      var contents = datan.slice(datan.indexOf('number_box')+25, datan.indexOf('bibliodetails'));
      var link = contents.slice(0, contents.indexOf('>')-1); 
      var res = contents.slice(contents.indexOf('>')+1,contents.indexOf('<'));

      $('#antal').html('<b>' + res + '</b><a href="https://' + window.location.hostname + link +'" target="_blank"> (Öppna kön i ny flik)</a>');

    });  
  };
});



// *************************************************************************************
// SPARADE LÅN - Varning med datum
// Vid försök av lån tidigare lånad bok så anges nu senast lånat datum i bekräftelserutan, även om annan streckkod av samma titel försöker lånas.
// ver 2.1

$('form#mainform').on('submit', function(event) {  // Spara senast dragna streckkod vid utlån i webbläsaren
  sessionStorage.setItem('lastbarcode',$('#barcode').val());
});

$('#circ_needsconfirmation').each(function() {  // Bekräfta lån-rutan
  var link = $.cookie('patronlink');
 
  if (link.indexOf("findborrower") > -1) {
    var type = "cardnumber=";
  }
  else {
    var type = "borrowernumber=";
  };

  link = link.slice(link.indexOf('=')+1);

if ($('#circ_needsconfirmation ul li').text().indexOf('previously ') > -1 | $('#circ_needsconfirmation ul li').text().indexOf('tidigare') > -1) {

  $('#circ_needsconfirmation ul').append('<h4 id="lastdateloading">Hämtar information... vänta</h4>');

  $.get('https://' + window.location.hostname + '/cgi-bin/koha/members/readingrec.pl?' + type + link).done(function(data) {

    var search = sessionStorage.getItem('lastbarcode');
    var content = data.slice(data.indexOf(search));
    content = content.slice(0, content.indexOf('="')+12);
    var barcode = content.slice(0, content.indexOf('<'));
    var lastdate = content.slice(content.indexOf('="')+2);

    if (lastdate.length > 0) {
      $('#circ_needsconfirmation #lastdateloading').remove();
      if (lastdate.indexOf('">') > -1) {
        $('#circ_needsconfirmation ul').append('<li id="lastdate">Senast lånad:\t <b>Okänt</b> <i>(före övergång till koha)</i></li>');
        sessionStorage.removeItem('lastbarcode');
      }
      else {
      $('#circ_needsconfirmation ul').append('<li id="lastdate">Senast lånad:\t <b>' + lastdate + '</b></li>');
      sessionStorage.removeItem('lastbarcode');
      };
    }
    else {
      $.get('https://' + window.location.hostname + '/cgi-bin/koha/catalogue/search.pl?q=' + search).done(function(detail) {  
        var content2 = detail.slice(detail.indexOf('class="title"')+30, detail.indexOf('class="results'));
        var title = content2.slice(0, content2.indexOf('<')-1); 
        var content3 = data.slice(data.indexOf(title));
        lastdate = content3.slice(content3.indexOf('title="')+7,content3.indexOf('title="')+18);

        if (lastdate.length > 0) {
          $('#circ_needsconfirmation #lastdateloading').remove();
          if (lastdate.indexOf('">') > -1) {
            $('#circ_needsconfirmation ul').append('<li id="lastdate">Senast lånad:\t <b>Okänt</b> <i>(före övergång till koha)</i></li>');
            sessionStorage.removeItem('lastbarcode');
          }
          else {
            $('#circ_needsconfirmation ul').append('<li id="lastdate">Senast lånad:\t <b>' + lastdate + '</b></li>');
            sessionStorage.removeItem('lastbarcode');
          };
        }
        else {
          $('#circ_needsconfirmation #lastdateloading').remove();
          $('#circ_needsconfirmation #lastdate').hide();
        };
      });
    };
  });
};
});



// *************************************************************************************
// Vid redigering av exemplar så sparas exemplaret automatisk ifall man drar streckkoden
// man behöver alltså inte klicka på knappen "Spara" vid redigering av exemplar.
// ver 1

$('#cataloguing_additem_newitem #f').has('#edititem').each(function() {

  $('#subfield952p input').keypress(function(event) {
    var keycode = event.keyCode || event.which;
    if(keycode == '13') {
      if ($(this).val()) {
        $('input[onclick="return Check(this.form)"]').trigger('click'); 
      }
    }
  });
});



// *************************************************************************************
// Personnummer endast 10 siffror och flytta fältet till ovan födelsedatum samt autofyll födelsedagsdatum, 
// Känner av att det är ett giltligt personnr annars rensar den fältet och ger ett meddelande.
// Kontrollerar även nu oxå att inte personnumret finns sedan innan registrerat i katalogen.
// ver 3.0

var validatePersonalNumber = function(input) {  // Valideringsscript för svenskt personnummer
  // Kontrollera godkänd längd och form
  if (!input) return false;

  if (input.indexOf('-') == -1) {
    if (input.length === 10) {
      input = input.slice(0, 6) + "-" + input.slice(6);
    } else {
      input = input.slice(0, 8) + "-" + input.slice(8);
    }
  }
  if (!input.match(/^(\d{2})(\d{2})(\d{2})\-(\d{4})|(\d{4})(\d{2})(\d{2})\-(\d{4})$/)) return false;

  // Snygga till input
  input = input.replace('-', '');
  if (input.length == 12) {
    input = input.substring(2);
  }

  // Deklarera variabler
  var d = new Date(((!!RegExp.$1) ? RegExp.$1 : RegExp.$5), (((!!RegExp.$2) ? RegExp.$2 : RegExp.$6)-1), ((!!RegExp.$3) ? RegExp.$3 : RegExp.$7)),
    sum = 0,
    numdigits = input.length,
    parity = numdigits % 2,
    i,
    digit;

  // Kontrollera godkänt datum 
  if (Object.prototype.toString.call(d) !== "[object Date]" || isNaN(d.getTime())) return false;

  // Kontrollera luhn algoritmen
  for (i = 0; i < numdigits; i = i + 1) {
    digit = parseInt(input.charAt(i))
    if (i % 2 == parity) digit *= 2;
      if (digit > 9) digit -= 9;
        sum += digit;
  }
  return (sum % 10) == 0;
};


$('#patron_attr_3').attr('maxlength','10').attr('placeholder','10 siffror (ÅÅMMDDNNNN)').attr('style','width: 174px; height: 22px;'); // Ge fältet rätt attribut

$('#patron_attr_3').parent().insertBefore('li label[for="dateofbirth"]'); // Flyttar personnrfältet till innan födelsedagsdatumfältet

$('#patron_attr_3').change(function() {  // Känner av ändring i personnrfältet och uppdaterar födelsedagsdatumfältet och OPAC användarnamnet

  if (validatePersonalNumber($(this).val())) {
    var d = new Date(); // Kollar det aktuella datumet
    var year = d.getFullYear(); // Sorterar ut vilket år det är
    year = year.toString().slice(0,2); // Gör om till sträng och ta bara med de två första siffrorna, dvs 19 eller 20
    
    var patronyear = $(this).val().slice(0,2); // Kollar personnummrets två första siffror och sparar det till variable

    if (patronyear > year) { // Kontrollerar om personen är mer än hundra år, om inte gör detta följande
      $('input#dateofbirth').val('19' + $(this).val().slice(0,2) + '-' + $(this).val().slice(2,4) + '-' + $(this).val().slice(4,6));
    }
    else {  // Personen är äntingen över hundra år (inte så troligt) så då förutsätter vi att personen är född på 2000-talet
      $('input#dateofbirth').val('20' + $(this).val().slice(0,2) + '-' + $(this).val().slice(2,4) + '-' + $(this).val().slice(4,6));
    };
  
    $('input#userid').val($(this).val());  // Kopierar även personnr till OPAC Användarnamnet

    chkpnr = $(this).val();

    $.get('https://' + window.location.hostname + '/cgi-bin/koha/circ/circulation.pl?findborrower=' + chkpnr).done(function(datan) {

      var contents = datan.slice(datan.indexOf('<title>')+7, datan.indexOf('</title>'));

      if (contents.indexOf('Låna ut') > -1 | contents.indexOf('Checking') > -1) {

        alert('Personnumret finns redan registrerat!');
        $('#patron_attr_3').css('background','red').focus().select();
    
      } else {
   
        $('#patron_attr_3').css('background','#d4efb7');
      };
    });

  }
  else {
    $('textarea[id="patron_attr_3"]').val(null);  // Rensa fältet
    alert("Personnummret är felaktigt, var god ändra.");  // Varna för fel personnr
    setTimeout(function(){$('textarea[id="patron_attr_3"]').focus();}, 1); // Ställ markören i fältet igen
  };
});



// *************************************************************************************
// Lägger automatiskt in samma nummer som fylls i mobilnummer till SMSnummer
// ver 1

$('input#mobile').change(function() {
    $('input#SMSnumber').val($(this).val());
});



// *************************************************************************************
// Tillåt endast siffror i telefonnummer och personnummer
// ver 1

$("input#mobile , #patron_attr_3").keydown(function (e) {
  var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
  var isCursorMoveOrDeleteAction = ([46,8,9,35,36,37,38,39,40].indexOf(e.keyCode) != -1);
  var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >=96 && e.keyCode <= 105);
  var vKey = 86, cKey = 67,aKey = 65, xKey = 88;
  switch(true){
    case isCursorMoveOrDeleteAction:
    case isModifierkeyPressed == false && isNumKeyPressed:
    case (e.metaKey || e.ctrlKey) && ([vKey,cKey,aKey,xKey].indexOf(e.keyCode) != -1):
    break;
    default:
    e.preventDefault();
  }
});



// *************************************************************************************
// Lägga in flera exemplar av samma bok utan extra knapptryck
// Markering av senast inlagt exemplar i listan med grönt

$('input[name="add_duplicate_submit"]').on('click', function(event) {
  localStorage.setItem('lastbarcode',$('#subfield952p input').val());
  localStorage.setItem('addmulti','yes');
});

$('body#cat_additem').each(function() {
if (localStorage.getItem('addmulti')) {
  $('#subfield952p input:eq(0)').focus().select();
  $('#subfield952p input:eq(0)').css('background-color','#d4efb7');
  $('#subfield952p input:eq(0)').attr('placeholder','Fortsätt dra nästa exemplar...');
  $('#subfield952p input').keypress(function(event) {
    var keycode = event.keyCode || event.which;
    if(keycode == '13') {
      if ($(this).val()) {
        localStorage.setItem('lastbarcode',$(this).val());
        $('input[name="add_duplicate_submit"]').trigger('click'); 
      }
    }
  });
};
});

$('#itemst td').text(function () {
  var lastbarcode = localStorage.getItem('lastbarcode');
  if ($(this).text() == lastbarcode) {
    $(this).closest('tr').children().css('background-color','#d4efb7');
    localStorage.removeItem('lastbarcode');
  }
});



// *************************************************************************************
// Gömmer redigeringsknapparna för nyheterna
	
$("p.newsfooter a").hide(); 

$("p.newsfooter").each(function() {
  var text = $(this).html().replace(/\|/g, ' ');
  $(this).html(text); 
});



// *************************************************************************************
// Felsökning i "Låna ut", ta med sökning till katalog, samt spara senast sökning så den visas i sökfältet som markerad text.

$('body#circ_circulation #doc3 #bd #yui-main .yui-b h4').each(function() {
  if ($(this).text().indexOf('Ingen låntagare hittad') >= 0) {
    $('<br /><h2>Sökte du på fel ställe kanske? Ingen fara!</h2> <br /><span>Prova sökknappen eller tryck ENTER igen.<br /><br /></span><button id="searchcat" class="btn btn-success btn-sm">Sök i katalogen</button>').insertAfter(this);
  };
});

$('#patronsearch').bind('submit',function(event) {
   if ($('#findborrower').val() == '') {
      event.preventDefault();
      $('#searchcat').trigger('click'); 
   }
});

$('#searchcat').on('click', function(event){
  var string = $('body#circ_circulation #doc3 #bd #yui-main .yui-b h4 span').text();
  var location = window.location.hostname;
  localStorage.setItem('lastsearch', string.slice(1,-1));
  window.location.assign("https://" + location + "/cgi-bin/koha/catalogue/search.pl?idx=kw&q=" + string);
});

$('body#catalog_results #search-form').attr('value', localStorage.getItem('lastsearch')).select();

$('#main_intranet-main').ready(function () {
    localStorage.removeItem('lastsearch');
});

$('#cat-search-block').bind('submit',function(event) {
  var string = $('#search-form').attr('value');
  localStorage.setItem('lastsearch', string);
});



// *************************************************************************************
// Klickbara hyllsignaturer

$('td.itemcallnumber').each(function() {
  var itemcallnr = $(this).text().slice(1);
  var location = window.location.hostname;
  $(this).html('<a href="https://'+location+'/cgi-bin/koha/catalogue/search.pl?idx=callnum&q='+itemcallnr+'">'+itemcallnr+'</a>');
});



// *************************************************************************************	
// Gör klassifikationer i katalogposten klickbara

$(".results_summary.oc").each(function() {
  var oc = $(this).text();
  oc = oc.slice(oc.indexOf(':')+2);
  localStorage.setItem('OC', oc);
  var link = '<a href="../catalogue/search.pl?idx=kw&q=lcn%3A'+ oc +'">' + oc + '</a>';
  $(".results_summary.oc").html(function () {
    return $(this).html().replace(oc, link);});
});



// *************************************************************************************
// Spara senaste låntagare som lånat eller återlämnat med hjälp av cookies
// ver 2.3

var midnight = new Date();
midnight.setHours(23,59,59,0);


$('#checkedintable tr:nth-child(1) td.ci-patron a:first, #hold-request-form a:first').each(function(){  // Senaste låntagaren som återlämnat eller reserverat
  var checkedinpatron = $(this).attr('href');
  var name = $(this).text();  
  if (name.indexOf(',') > -1) {
    var surname = name.slice(name.indexOf(',')+2, name.indexOf('('));
    var lastname = name.slice(2, name.indexOf(','));
    var patronname = surname.concat(lastname);

    document.cookie = "lastpatron=" + patronname + " [ Återlämnat ]; expires=" + midnight + "; path=/ " ; 

  }
  else {
    var patronname = $(this).text();
    document.cookie = "lastpatron=" + patronname + "; expires=" + midnight + "; path=/ " ; 
  };

  var patronlink = checkedinpatron.slice(checkedinpatron.indexOf('?')+1);
  document.cookie = "patronlink=" + patronlink + "; expires=" + midnight + "; path=/ " ; 

  savePatron();

});



$('div.patroninfo h5').each(function(){  // Spara senaste låntagaren som laddats
  var name = $(this).text().replace(/\s+/g, " ");
  var cardnumber = name.substring(name.lastIndexOf("(")+1,name.lastIndexOf(")"));
  var patronlink = 'findborrower=' + cardnumber;  

  document.cookie = "lastpatron=" + name + "; expires=" + midnight + "; path=/ " ; 
  document.cookie = "patronlink=" + patronlink + "; expires=" + midnight + "; path=/ " ; 

  savePatron();

});   


function savePatron() {  // Spara ner låntagare i listan ifall hen inte finns med förut

  var d = new Date();
  time = d.toTimeString();
  time = time.split(' ')[0];

  document.cookie = "timestamp=" + time + "; expires=" + midnight + "; path=/ " ; 

  var name = $.cookie('lastpatron');
  var link = $.cookie('patronlink');
  var time = $.cookie('timestamp');

  if ($.cookie('lastpatrons')) {
    
    var theString = $.cookie('lastpatrons');
    var lastpatrons = theString.split(",");
    var theString2 = $.cookie('patronlinks');
    var patronlinks = theString2.split(",");
    var theString3 = $.cookie('timestamps');
    var timestamps = theString3.split(",");

    if (patronlinks.indexOf(link) > -1) {  
      patronlinks.splice($.inArray(link, patronlinks), 1);
      lastpatrons.splice($.inArray(name, lastpatrons), 1);
      timestamps.splice($.inArray(time, timestamps), 1);
    };

    }
    else {
      var lastpatrons = [];
      var patronlinks = [];
      var timestamps = [];
    };

    lastpatrons.unshift(name);
    patronlinks.unshift(link);
    timestamps.unshift(time);

    if (lastpatrons.length > 15) {
       lastpatrons.pop();
       patronlinks.pop();
       timestamps.pop();
    };

    document.cookie = "lastpatrons=" + lastpatrons + "; expires=" + midnight + "; path=/ "; 
    document.cookie = "patronlinks=" + patronlinks + "; expires=" + midnight + "; path=/ " ; 
    document.cookie = "timestamps=" + timestamps + "; expires=" + midnight + "; path=/ " ; 

};


if ($.cookie('lastpatron')) { // Visa knappen ifall det finns en sparad låntagare
  var lpatron = $.cookie('lastpatron');
  $('<span> </span><button id="lastpatron">Senaste låntagare</button>').insertAfter('input[id="autocsubmit"]');
  $('<a href="#" id="clearlpatron"> Rensa</a>').insertAfter('#lastpatron');
};

$("<a href='#' id='patronspan'> "+lpatron+"</a>").insertBefore('#clearlpatron').hide();  

$('#lastpatron').mouseover(function(event){
  event.preventDefault();
  $("#clearlpatron").hide();  
  $("#patronspan").show();
});

$('#lastpatron').mouseout(function(event){
  event.preventDefault();
  $("#clearlpatron").show();  
  $("#patronspan").hide();
});

$('#lastpatron').on('click', function(event){ // Öppna senaste låntagare
  if ($.cookie('lastpatron')) {
    event.preventDefault();
    var patronlink = $.cookie('patronlink');
    var location = window.location.hostname;
    window.location.assign("https://" + location + "/cgi-bin/koha/circ/circulation.pl?" + patronlink);
  };
});

$('#clearlpatron').on('click', function(event){ // Rensa senaste låntagare

  $.removeCookie('patronlink', { path: '/' });
  $.removeCookie('lastpatron', { path: '/' });
  $.removeCookie('lastpatrons', { path: '/' });
  $.removeCookie('patronlinks', { path: '/' });
  $.removeCookie('timestamp', { path: '/' });
  $.removeCookie('timestamps', { path: '/' });

  $('#lastpatron').hide();
  $('#clearlpatron').hide();
  $('#lastpatrons').hide();  
});


// Knapp för att visa flera av senaste låntagare

$('<span> </span><div class="btn-group" style="vertical-align:unset;"><button id="lastpatrons" class="dropdown-toggle" data-toggle="dropdown">Fler<span class="caret"></span></button><ul id="patron-dropdown" class="dropdown-menu"></ul></div>').insertAfter('#lastpatron');


$('#lastpatrons').on('click', function(event){ // Öppna listan med senaste låntagare

  var lp = $.cookie('lastpatrons');
  var names = lp.split(",");
  var pl = $.cookie('patronlinks');
  var links = pl.split(",");
  var ts = $.cookie('timestamps');
  var times = ts.split(",");
  var list = $("#patron-dropdown");
  var parent = list.parent();
  var location = window.location.hostname;

  list.detach().empty().each(function(i){
    for (var x = 0; x < names.length; x++){
      $(this).append('<li><a href="https://' + location + '/cgi-bin/koha/circ/circulation.pl?' + links[x] + '"><span class="timestamps">' + times[x].slice(0,5) + ' </span>' + names[x] + '</a></li>');
      if (x == names.length - 1){
        $(this).appendTo(parent);
      }
    }
  });
});



// *************************************************************************************
// Snabbaccess till senaste låntagare vid reservation
// ver 2.1

if ($.cookie('lastpatron')) {
  var name = $.cookie('lastpatron');
  var link = $('#holds_patronsearch').attr('action');
  var location = window.location.hostname;
  var patronlink = $.cookie('patronlink');
  $('<br /><br /><span>eller reservera för senaste låntagaren: </span><a href="https://' + location + '/cgi-bin/koha/reserve/' + link + '&' + patronlink +'" id="hold">' + name + '</a>').insertAfter('#holds_patronsearch input[type="submit"]');

  $('<span> </span><div class="btn-group" style="vertical-align:unset;"><button id="lastpatrons_res" class="dropdown-toggle" data-toggle="dropdown">Fler<span class="caret"></span></button><ul id="patron-dropdown2" class="dropdown-menu"></ul></div>').insertAfter('#hold');

  $('#lastpatrons_res').on('click', function(event){ // Öppna listan med senaste låntagare

    var reslp = $.cookie('lastpatrons');
    var resnames = reslp.split(",");
    var respl = $.cookie('patronlinks');
    var reslinks = respl.split(",");
    var rests = $.cookie('timestamps');
    var restimes = rests.split(",");
    var reslist = $("#patron-dropdown2");
    var resparent = reslist.parent();
    var location = window.location.hostname;
    var reslink = $('#holds_patronsearch').attr('action');

    reslist.detach().empty().each(function(i){
      for (var x = 0; x < resnames.length; x++){
        $(this).append('<li><a href="https://' + location + '/cgi-bin/koha/reserve/' + link + '&' + reslinks[x] +'" id="hold"><span class="timestamps">' + restimes[x].slice(0,5) + ' </span>' + resnames[x] + '</a></li>');
        if (x == resnames.length - 1){
          $(this).appendTo(resparent);
        }
      }
    });
  });
};





// *************************************************************************************
// Ta bort tidsstämpeln på återlämnade böcker

$("td.ci-duedate:contains('23:59')").each(function() {
  var text = $(this).html().replace('23:59', '');
  $(this).html(text); 
});



// *************************************************************************************
// Markerar raden med det aktuella exemplaret efter sökt streckkod

$('#cat-search-block .submit').on('click', function(){  // Vanlig katalogsökning
  $('input[type="text"]').each(function(){    
    var id = $(this).attr('id');
    var value = $(this).val();
    localStorage.setItem(id, value);
  });   
});

$('form[action="search.pl"] .btn').on('click', function(){ // Avancerad sökning
  $('input[type="text"]').each(function(){    
    var value = $(this).val();
    if (value !== '') {
      localStorage.setItem('search-form', value);
    }
  });   
});

$('td a[href^="/cgi-bin/koha/catalogue/moredetail.pl"]').text(function () {
  var storedsearch = localStorage.getItem('search-form');
  if ($(this).text() == storedsearch) {
    $(this).closest('tr').children().css('background-color','#d4efb7');
    localStorage.removeItem('search-form');
  }
});



// *************************************************************************************
// Lägger in taggen #additema så fokus hamnar på ememplarinläggningen vid Nytt exemplar

$('#cataloguing_additem_newitem #f').attr('action', '/cgi-bin/koha/cataloguing/additem.pl#additema');



// *************************************************************************************
// Visa fler/färre på resultatsidan
// Märker även tillgängligheten med grön/röd
// ver 3.1

if ($('.logged-in-branch-name:first()').text().length > 0) {
  var loggedinbranch = $('.logged-in-branch-name:first()').text();
  localStorage.setItem('loggedinbranch', loggedinbranch);
};

$('.availability').each(function() {
  var LiN = $(this).find('li').length;

  if( LiN > 0) {    
    $('li', this).hide().addClass('toggleable');
    $(this).append('<span class="more">Visa fler...</span>');    
  }
});

$('.availability li').each(function() {
  var loggedinbranch = $('.logged-in-branch-name:first()').text();
    if ($(this).text().indexOf(loggedinbranch) > -1 ) {

      $(this).removeClass('toggleable').show();

      if ($(this).parent().prev().hasClass('status') | $(this).parent().prev().hasClass('unavailable')) {
        $(this).css('background','#ffe7e7');
      } else {
        $(this).css('background','#d4efb7');
      };

// Karlsborg - Undenäs - Mölltorp

      if (loggedinbranch.indexOf('Karlsborg') > -1 | loggedinbranch.indexOf('Undenäs') > -1 | loggedinbranch.indexOf('Mölltorp') > -1 ) {
        $('.availability li').each(function() {
          if ($(this).text().indexOf('Karlsborg') > -1 | $(this).text().indexOf('Undenäs') > -1 | $(this).text().indexOf('Mölltorp') > -1 ) {
            $(this).removeClass('toggleable').show();

            if ($(this).parent().prev().hasClass('status') | $(this).parent().prev().hasClass('unavailable')) {
              $(this).css('background','#ffe7e7');
            } else {
              $(this).css('background','#d4efb7');
            };
          };
        });
      };

// Tidaholm - KVA

      if (loggedinbranch.indexOf('Tidaholm') > -1 ) {
        $('.availability li').each(function() {
          if ($(this).text().indexOf('Tidaholm') > -1 ) {
            $(this).removeClass('toggleable').show();

            if ($(this).parent().prev().hasClass('status') | $(this).parent().prev().hasClass('unavailable')) {
              $(this).css('background','#ffe7e7');
            } else {
              $(this).css('background','#d4efb7');
            };
          };
        });
      };



    };
});

$('.availability').on('click','.more', function() {
  if( $(this).hasClass('less') ) {    
    $(this).text('Visa fler...').removeClass('less');    
  }
  else {
    $(this).text('Visa färre...').addClass('less'); 
  }
  $(this).parent().children('ul').children('li.toggleable').slideToggle("fast");
}); 



// *************************************************************************************
// Sortera biblioteken i träfflistan i alfabetisk ordning
// ver 1

$(".availability ul").each(function() {
  $(this).html(
    $(this).children("li").sort(function (a, b) {
      return $(a).text().toUpperCase().localeCompare(
      $(b).text().toUpperCase());
    }) 
  );
});



// *************************************************************************************
// Markera "Tillgänglig" med grönt på detaljsidan
// ver 1

$('#bibliodetails .status').each(function() {
  if ($(this).text().indexOf('Tillgänglig') > -1 | $(this).text().indexOf('Available') > -1 ) {
    $(this).css('color', 'green');
  };
});



// *************************************************************************************
// Göm Alternativ adress och Mer information som standard vid låntagaranmälan
// ver 2

$('#memberentry_address ol, #memberentry_patron_attributes ol').hide();

$('legend').click(function() {
  $(this).parent().find('ol').slideToggle("fast");
});



// *************************************************************************************
// When an empty barcode is entered it will return to main page

$('#mainform').bind('submit',function() {
  if ($('#barcode').val() == '') {
    window.location.href = "http://" + document.domain; 
  }
});



// *************************************************************************************
// When Pause-Break button is pressed it will return to main page

document.onkeydown=function keypress(e) {
  e=(e||window.event);  
    if (e.keyCode == 19) {
      try{e.preventDefault();}//Non-IE
      catch(x){e.returnValue=false;} //IE (verkade inte fungera!)
      window.location.href = "https://" + window.location.hostname;
    };
}



// *************************************************************************************
// Översättningar

$('a[href="#otherholdings"]').text(function () {
  return $(this).text().replace('Andra reservationer', 'Andra bibliotek');
});

$('label[for="mobile"]').text(function () {
  return $(this).text().replace('Annan telefon', 'Mobiltelefon');
});

$('#circmessages h3').html(function() {
  return $(this).html().replace('Till', 'Upplysningar');
});

$('#printquickslip').text(function () {
  return $(this).text().replace('Skriv ut snabbkvitto', 'Skriv ut endast nya lån');
});

});


// *************************************************************************************
// SAKER SOM SKA HÄNDA ALLRA SIST

$(document).ready(function() {
 // Fires LAST
 // This event will fire after all the other $(document).ready() functions have completed.
 // Usefull when your script is at the top of the page, but you need it run last
 $(document).trigger("my-event-afterLastDocumentReady");
});

$(document).on("my-event-afterLastDocumentReady", function () {
  if($('body#cat_additem').length == 0) {
    localStorage.removeItem('addmulti');  // Sparning av flera exemplar aktiverat
  };
});
