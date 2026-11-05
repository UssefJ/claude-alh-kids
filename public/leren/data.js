const PROPHETS=['Adam','Idris','Noeh','Hoed','Salih','Ibrahim','Loet','Isma’il','Ishaq','Ya’qoeb','Yoesoef','Ayyoeb','Dhoel-Kifl','Sjoe’ayb','Moesa','Haroen','Dawoed','Soelayman','Ilyas','Al-Yasa’','Yoenoes','Zakariyya','Yahya','Isa','Mohammed'];
const LESSONS=[['ouders','Papa en mama','heart'],['dieren','Lief voor dieren','paw'],['spelen','Samen spelen','people'],['delen','Samen delen','hands'],['geld','Geld en geven','coin'],['eerlijk','Eerlijk zijn','chat'],['dankbaar','Dankbaar zijn','flower'],['geduld','Geduld hebben','hourglass'],['boos','Als je boos bent','cloud'],['helpen','Elkaar helpen','hands']];
const DUAS=[['huis-in','Bij binnenkomst in huis','home'],['huis-uit','Bij het verlaten van huis','home'],['toilet-in','Bij het binnengaan van het toilet','toilet'],['toilet-uit','Bij het verlaten van het toilet','toilet'],['eten','Beginnen met eten','food'],['gegeten','Klaar met eten','food'],['niezen','Na het niezen','sneeze'],['leren','Voor het leren','book']];
const DEFAULT_STORIES={
noeh:{id:'noeh',category:'profeten',title:'Profeet Noeh',subtitle:'De ark en het vertrouwen op Allah',duration:420,source:'Vrije kinderversie op basis van soerah Noeh 71:1–10 en Hoed 11:36–49. De reflectievragen zijn toegevoegd voor kinderen. Inhoudelijke eindcontrole volgt vóór de echte lancering.',parts:[
{title:'Noeh vertelt over Allah',start:0,scene:0,alt:'Een rustige oude nederzetting met huizen en palmbomen, zonder mensen.',text:`Lang, heel lang geleden leefde de profeet Noeh, vrede zij met hem. Allah had hem een belangrijke taak gegeven. Hij moest de mensen vertellen dat zij alleen Allah moesten aanbidden.

Veel mensen aanbaden beelden. Noeh nodigde hen uit om daarmee te stoppen en naar Allah te luisteren. Hij vertelde hun ook dat zij Allah om vergeving konden vragen.

Maar veel mensen wilden niet luisteren. Sommigen stopten zelfs hun vingers in hun oren. Noeh bleef hen uitnodigen. Overdag en ’s nachts. Soms sprak hij met een groep, soms met mensen apart.

Dat vraagt veel geduld. Weet jij wat geduld betekent? Dat je niet meteen opgeeft wanneer iets moeilijk is.

Er waren mensen die Noeh geloofden, maar het waren er weinig. Toch betekende dat niet dat zijn boodschap verkeerd was. Iets wordt niet waar omdat veel mensen het zeggen. En iets wordt niet verkeerd omdat maar weinig mensen erin geloven.

Dat kun je soms zelf ook meemaken. Misschien wil een groepje kinderen iemand niet laten meespelen. Jij kunt dan toch besluiten om vriendelijk te zijn.

Bij Noeh was zijn taak natuurlijk veel groter. Hij was een profeet van Allah. Hij bleef zijn volk oproepen om Allah te aanbidden. Noeh vertelde Allah wat er gebeurde en vroeg Hem om hulp.

Ook jij mag Allah om hulp vragen. Als iets moeilijk is, als je verdrietig bent of wanneer je iets nieuws probeert te leren.`},
{title:'De bouw van de ark',start:140,scene:1,alt:'Een houten ark in aanbouw met planken en gereedschap op het droge land.',text:`Toen kreeg Noeh van Allah de opdracht om een ark te bouwen. Een ark is een groot schip. Allah begeleidde hem daarbij. Noeh begon aan het werk.

Wanneer leiders van zijn volk langskwamen, lachten zij hem uit. Toch stopte hij niet met bouwen. Hij hield zich aan de opdracht van Allah.

Uitgelachen worden kan pijn doen. Daarom lachen wij iemand niet uit die zijn best doet. We kunnen juist helpen of iets aardigs zeggen.

Denk eens aan een kind dat voor het eerst een moeilijke puzzel maakt. Of iemand die nog leert om letters te lezen. Iedereen moet oefenen. Het helpt als iemand geduldig naast je zit en je aanmoedigt.

In het verhaal van Noeh zien we hoe belangrijk het is om het goede te blijven doen, ook wanneer anderen je niet aanmoedigen.

Toen de tijd gekomen was, gaf Allah Noeh opdracht om dieren in paren mee te nemen. Ook de mensen die geloofden, gingen aan boord. Noeh noemde de naam van Allah bij het varen en het tot stilstand komen van de ark.

Er kwam een grote overstroming. De ark voer tussen heel hoge golven. Dit is ook een verdrietig deel van het verhaal: niet iedereen ging mee, en mensen kwamen om in het water. De Quran vertelt dat Allah Noeh en de gelovigen die bij hem waren redde.

Het verhaal gaat niet alleen over een bijzonder schip. Het gaat ook over luisteren naar Allah en vertrouwen op Hem.`},
{title:'De ark komt tot rust',start:280,scene:2,alt:'De houten ark bij een groene berg nadat het water is gezakt.',text:`Op bevel van Allah zakte het water. De ark kwam tot rust op de berg Al-Djoedi. De reis over het water was voorbij.

Noeh mocht de ark verlaten, met vrede en zegeningen van Allah. Na dit grote gebeuren kon het leven op het land verdergaan.

Hier kunnen we even nadenken over dankbaarheid. Waar ben jij vandaag dankbaar voor? Misschien voor je eten. Voor iemand die voor je zorgt. Of voor een vriend met wie je fijn hebt gespeeld.

Je kunt Allah daarvoor bedanken en zeggen: alhamdoelillah. Dat betekent: alle lof is voor Allah.

We hebben geleerd over Noeh, zijn boodschap en de ark. Noeh bleef geduldig. Hij bleef de mensen uitnodigen om Allah te aanbidden. En toen Allah hem een opdracht gaf, voerde hij die uit.

Wij kunnen oefenen met geduld, anderen niet uitlachen en Allah om hulp vragen. Je hoeft niet alles meteen te kunnen. Leren gaat stap voor stap. Als iets moeilijk is, mag je hulp vragen aan iemand die voor je zorgt.

Denk nog eens aan het verhaal. Wat bouwde Noeh? Wat deed hij toen mensen hem uitlachten? En hoe kun jij vandaag vriendelijk zijn voor iemand die zijn best doet?

Kies één klein ding dat je vandaag wilt oefenen. Misschien iemand aanmoedigen. Misschien rustig opnieuw proberen. Een kleine goede stap is al een mooi begin.`}]},
dieren:{id:'dieren',category:'levenslessen',title:'Lief voor dieren',subtitle:'Een kleine daad van zorg',duration:420,source:'Een verzonnen leersituatie over zorgzaamheid en respect voor dieren. Geen letterlijke Quran- of hadithtekst.',parts:[
{title:'Een kat in de tuin',start:0,scene:3,alt:'Een roodbruine kat ligt rustig bij struiken in een tuin.',text:`Sami loopt met mama de tuin in. Bij de struiken ziet hij iets bewegen. Twee kleine oren komen boven de bladeren uit. Het is een roodbruine kat.

Sami wil er meteen naartoe rennen. Hij vindt katten zo leuk! Maar mama vraagt hem even te wachten. De kat kent hem nog niet. Een onbekend kind dat snel dichterbij komt, kan hem laten schrikken.

Samen blijven ze op afstand. Sami kijkt rustig. De kat mag zelf kiezen of hij dichterbij wil komen. Hij hoeft niet geaaid te worden omdat Sami dat graag wil.

Mama vertelt dat we als moslims goed voor dieren zorgen. Een dier is geen speelgoed. Het kan dorst hebben, schrikken en moe zijn. Ook een klein dier verdient een zachte behandeling.

Sami doet een stapje achteruit. Hij praat zacht. De kat kijkt even op en gaat daarna weer liggen. Sami begrijpt het: vandaag wil de kat misschien gewoon rust.

Heb jij weleens een dier gezien dat wilde weglopen? Wat zou je dan kunnen doen? Je kunt stoppen en het dier ruimte geven. Vraag een volwassene om hulp als je niet weet wat veilig is.

Sami hoeft de kat niet aan te raken om vriendelijk te zijn. Soms is juist rustig kijken een mooie manier om goed voor een dier te zijn.`},
{title:'Samen goed verzorgen',start:140,scene:4,alt:'Dezelfde kat drinkt uit een ondiep blauw waterbakje in de schaduw.',text:`Het is warm in de tuin. Mama haalt een schoon, ondiep bakje. Samen vullen ze het met vers water. Ze zetten het op een rustige plek in de schaduw en lopen weer een stukje weg.

Sami kijkt nieuwsgierig. Zal de kat komen drinken? Hij wacht. Niet roepen, niet duwen en niet achter de kat aanlopen. De kat mag zelf komen.

Na een tijdje loopt de kat naar het bakje. Hij drinkt met kleine likjes. Sami glimlacht. Hij heeft geholpen zonder het dier bang te maken.

Dan denkt Sami aan zijn koekje. Zou de kat dat ook lekker vinden? Hij vraagt het eerst aan mama. Dat is verstandig: niet alles wat mensen eten, is goed voor een dier. Je geeft een dier daarom niet zomaar iets te eten. Een volwassene kan uitzoeken wat passend is.

Goed verzorgen is meer dan één keer iets aardigs doen. Een dier dat bij mensen woont, heeft elke dag passende zorg nodig. Schoon water, geschikt eten, een fijne rustplek en hulp wanneer het ziek is. De volwassenen zijn daarvoor verantwoordelijk.

Een kind kan meehelpen met een kleine taak. Bijvoorbeeld samen een waterbakje schoonmaken. Daarna wassen Sami en mama hun handen.

Wat zou jij samen met een volwassene kunnen doen? Je hoeft niet iets groots te bedenken. Een klein beetje hulp kan al fijn zijn.`},
{title:'Zacht zijn, ook tijdens het spelen',start:280,scene:5,alt:'De roodbruine kat slaapt rustig in een zachte mand bij de tuin.',text:`Later komt Sami’s vriendje langs. Hij ziet de kat en wil ermee spelen. Sami vertelt wat hij heeft geleerd: eerst rustig kijken, afstand houden en een volwassene vragen.

Ze gaan niet achter de kat aan. Ze trekken niet aan zijn staart of oren. Als de kat wegloopt, laten ze hem gaan. Een dier mag ook klaar zijn met spelen.

Bij de deur staat een mand. De kat kruipt erin en rolt zich op. Zijn ogen gaan langzaam dicht. Sami en zijn vriendje kiezen een ander spel, wat verder van de mand. Zo kan de kat slapen.

Ook dieren die we niet kunnen aaien, verdienen zorg. We laten vogels rustig bij hun nest. We kijken naar kleine beestjes zonder ze expres pijn te doen. Een dier dat gewond lijkt, raken we niet zomaar aan: we halen een volwassene.

Soms vergeet iemand even om zacht te doen. Dan kun je rustig zeggen dat het dier rust nodig heeft. Je kunt samen opnieuw proberen. Je hoeft niet boos te schreeuwen om voor een dier op te komen.

Wat heeft Sami vandaag geleerd? Dat een dier geen speelgoed is. Dat hij eerst hulp kan vragen. En dat zorgen soms betekent dat je een dier juist met rust laat.

Denk nu aan één dier dat jij kent. Wat heeft dat dier nodig? En welke kleine, vriendelijke stap kun jij samen met een volwassene zetten?

Goed zijn voor dieren begint met aandacht: kijken, nadenken en zacht handelen.`}]}
};

const DUA_CONTENT={
leren:{title:'Voor het leren',ar:'رَبِّ زِدْنِي عِلْمًا',nl:'Mijn Heer, vermeerder mijn kennis.',phon:'Rabbi zidnie ‘ilmaa',note:'Dua uit de Quran',source:'Ta-Ha 20:114',sourceUrl:'https://quran.com/20/114'},
 'toilet-in':{title:'Bij het binnengaan van het toilet',ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',nl:'O Allah, ik zoek bescherming bij U tegen de mannelijke en vrouwelijke duivels.',phon:'Allaahoemma innie a‘oedhoe bika minal-khoeboethi wal-khabaa’ith.',note:'Zeg deze dua voordat je het toilet binnengaat.',source:'Sahih al-Bukhari 142',sourceUrl:'https://sunnah.com/bukhari:142'}
};
DEFAULT_STORIES.ouders={id:'ouders',category:'levenslessen',title:'Papa en mama',subtitle:'Lief zijn begint met kleine dingen',duration:420,source:'Een verzonnen kinderverhaal over vriendelijk omgaan met ouders, helpen en dankbaarheid. Geen letterlijke Quran- of hadithtekst. De geschatte leestijd is ongeveer zeven minuten, met rustige pauzes en vragen.',parts:[
{title:'Een fijne ochtend',start:0,imageUrl:'../assets/family-hug.png',alt:'Papa en mama omhelzen hun zoon en dochter.',text:`Sami bouwt een hoge toren. Zijn zusje Maryam legt er voorzichtig een blok bovenop. De toren wiebelt. Blijft hij staan? Ja! Samen lachen ze. Dan horen ze mama vanuit de keuken: “Het ontbijt is klaar. Komen jullie aan tafel?”

Sami wil nog één blok neerleggen. En daarna nog één. Hij hoort mama wel, maar hij zegt niets. Papa komt bij de deur staan. “Heb je mama gehoord?” Sami knikt. “Ik wil mijn toren afmaken.”

Papa gaat even naast hem zitten. “Dat snap ik. Je bent fijn aan het spelen. Je kunt mama wel antwoord geven. Dan weet zij dat je haar gehoord hebt.” Sami denkt na. Dan roept hij: “Ja mama, ik kom eraan!” Hij legt zijn laatste blok neer en loopt mee.

Aan tafel ziet hij brood, bekers en fruit. Iemand heeft dat allemaal klaargezet. Mama en papa zorgen elke dag voor veel kleine dingen. Ze helpen met aankleden, zoeken een kwijtgeraakte sok en luisteren wanneer iets niet fijn gaat.

“Weet je hoe je iets liefs kunt doen?” vraagt papa. Sami denkt aan een heel groot cadeau. Maar mama schudt vriendelijk haar hoofd. “Een bedankje is ook fijn.” Sami zegt: “Dank je wel voor het ontbijt.” Maryam zegt het ook. Mama glimlacht.

Als moslims oefenen we om vriendelijk en respectvol met onze ouders om te gaan. Dat kan met zachte woorden. Met even luisteren. Of met een klein beetje hulp. Je hoeft daarvoor niet groot te zijn.

Denk eens na: wie heeft jou vandaag geholpen? En waarvoor zou jij die persoon kunnen bedanken? Neem maar even de tijd.`},
{title:'Samen helpen en rustig praten',start:140,imageUrl:'../assets/family-hug.png',alt:'Het gezin zit dicht bij elkaar in een warme groepsknuffel.',text:`Na het ontbijt ruimt papa de tafel af. Sami wil terug naar zijn toren. Dan ziet hij zijn lege beker. “Kan ik die meenemen?” vraagt hij. Papa knikt. “Zet hem maar op het aanrecht. Dank je wel.” Maryam brengt de servetten. Zo helpt iedereen met iets kleins.

Helpen betekent niet dat kinderen alles moeten doen. Een zware pan of een scherp mes laat je aan een volwassene over. Je kunt wel je speelgoed opruimen, je schoenen op hun plek zetten of vragen: “Waarmee kan ik helpen?” Samen gaat een klusje vaak fijner.

Later wil Sami naar buiten. Maar mama zegt dat ze eerst nog iets moet afmaken. Sami voelt zijn buik warm worden. Hij wil nú naar buiten. Zijn voeten willen stampen en zijn stem wil heel hard worden.

Mama ziet dat hij teleurgesteld is. “Je had zin om te spelen, hè?” Sami knikt. Hij haalt even adem. Dan zegt hij: “Ik vind wachten moeilijk. Wanneer kunnen we gaan?” Nu kunnen ze rustig praten. Mama legt uit wat er nog moet gebeuren. Sami kiest ondertussen een boek om samen met Maryam te bekijken.

Lief zijn voor je ouders betekent niet dat je nooit boos of verdrietig mag zijn. Je mag vertellen wat je voelt. Je mag vragen stellen en zeggen dat je iets niet begrijpt. We oefenen om dat zonder schelden of slaan te doen.

Soms lukt dat niet meteen. Dan kun je stoppen, rustig ademhalen en opnieuw beginnen. Je kunt zeggen: “Sorry dat ik zo hard riep. Ik zal het nog eens rustig zeggen.”

Welke woorden zou jij gebruiken als je graag iets wilt, maar even moet wachten? Oefen die zin maar samen.`},
{title:'Een knuffel en een bedankje',start:280,imageUrl:'../assets/family-hug.png',alt:'Twee kinderen knuffelen hun ouders; de kinderen zijn van achteren te zien.',text:`Die avond zit het gezin op het zachte kleed. Maryam kruipt bij mama en Sami gaat naast papa zitten. “Wat vond je fijn vandaag?” vraagt mama. Sami vertelt over zijn toren. Maryam vertelt over buiten spelen. Papa luistert tot ze klaar zijn.

Dan denkt Sami aan het ontbijt en aan de hulp bij zijn schoenen. “Jullie doen veel voor ons,” zegt hij. Mama knikt. “We houden van jullie. En jullie hoeven niet alles perfect te doen om geliefd te zijn.”

Sami slaat zijn armen om papa heen. Maryam wil ook knuffelen. Even zitten ze allemaal dicht bij elkaar. Een knuffel kan fijn zijn, als je daar zin in hebt. Heb je liever even geen knuffel? Dan mag je dat zeggen. Een glimlach of een lief woord kan ook.

Sami wil morgen weer iets kleins doen. Hij gaat zijn schoenen netjes neerzetten en mama bedanken wanneer zij hem helpt. Maryam wil haar blokken opruimen. Ze hoeven niet te wachten op een bijzondere dag om vriendelijk te zijn.

Voor het slapen bedanken ze Allah voor de mensen die voor hen zorgen. Ze vragen Allah om goed voor hun ouders te zorgen en hen te helpen om vriendelijk te zijn. Je mag Allah ook met je eigen woorden iets vragen.

Niet ieder gezin is hetzelfde. Sommige kinderen wonen bij één ouder, bij grootouders of bij andere verzorgers. Ook daar kun je oefenen met helpen, luisteren en dankjewel zeggen. En als iets je bang of verdrietig maakt, mag je altijd hulp vragen aan een volwassene die je vertrouwt.

Wat kies jij voor morgen? Een vriendelijk antwoord geven? Iets kleins opruimen? Of iemand bedanken? Kies maar één ding. Kleine goede daden passen ook bij kleine handen.`}
]};
