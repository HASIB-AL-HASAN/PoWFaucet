

// THIS FILE IS GENERATED AUTOMATICALLY
// Don't edit this file by hand. 
// Edit the build located in the faucet-wasm folder.

let scrypt;
let scryptPromise;

module.exports = {
  getScrypt: function() { return scrypt; },
  getScryptReadyPromise: function() { return scryptPromise; }
};


/**
  Base32768 is a binary-to-text encoding optimised for UTF-16-encoded text.
  (e.g. Windows, Java, JavaScript)
*/

// Z is a number, usually a uint15 but sometimes a uint7

const BITS_PER_CHAR = 15 // Base32768 is a 15-bit encoding
const BITS_PER_BYTE = 8

const pairStrings = [
  'ҠҿԀԟڀڿݠޟ߀ߟကဟႠႿᄀᅟᆀᆟᇠሿበቿዠዿጠጿᎠᏟᐠᙟᚠᛟកសᠠᡟᣀᣟᦀᦟ᧠᧿ᨠᨿᯀᯟᰀᰟᴀᴟ⇠⇿⋀⋟⍀⏟␀␟─❟➀➿⠀⥿⦠⦿⨠⩟⪀⪿⫠⭟ⰀⰟⲀⳟⴀⴟⵀⵟ⺠⻟㇀㇟㐀䶟䷀龿ꀀꑿ꒠꒿ꔀꗿꙀꙟꚠꛟ꜀ꝟꞀꞟꡀꡟ',
  'ƀƟɀʟ'
]

const lookupE = {}
const lookupD = {}
pairStrings.forEach((pairString, r) => {
  // Decompression
  const encodeRepertoire = []
  pairString.match(/../gu).forEach(pair => {
    const first = pair.codePointAt(0)
    const last = pair.codePointAt(1)
    for (let codePoint = first; codePoint <= last; codePoint++) {
      encodeRepertoire.push(String.fromCodePoint(codePoint))
    }
  })

  const numZBits = BITS_PER_CHAR - BITS_PER_BYTE * r // 0 -> 15, 1 -> 7
  lookupE[numZBits] = encodeRepertoire
  encodeRepertoire.forEach((chr, z) => {
    lookupD[chr] = [numZBits, z]
  })
})

const encode = uint8Array => {
  const length = uint8Array.length

  let str = ''
  let z = 0
  let numZBits = 0

  for (let i = 0; i < length; i++) {
    const uint8 = uint8Array[i]

    // Take most significant bit first
    for (let j = BITS_PER_BYTE - 1; j >= 0; j--) {
      const bit = (uint8 >> j) & 1

      z = (z << 1) + bit
      numZBits++

      if (numZBits === BITS_PER_CHAR) {
        str += lookupE[numZBits][z]
        z = 0
        numZBits = 0
      }
    }
  }

  if (numZBits !== 0) {
    // Final bits require special treatment.

    // z = bbbbbbcccccccc, numZBits = 14, padBits = 1
    // z = bbbbbcccccccc, numZBits = 13, padBits = 2
    // z = bbbbcccccccc, numZBits = 12, padBits = 3
    // z = bbbcccccccc, numZBits = 11, padBits = 4
    // z = bbcccccccc, numZBits = 10, padBits = 5
    // z = bcccccccc, numZBits = 9, padBits = 6
    // z = cccccccc, numZBits = 8, padBits = 7
    // => Pad `z` out to 15 bits using 1s, then encode as normal (r = 0)

    // z = ccccccc, numZBits = 7, padBits = 0
    // z = cccccc, numZBits = 6, padBits = 1
    // z = ccccc, numZBits = 5, padBits = 2
    // z = cccc, numZBits = 4, padBits = 3
    // z = ccc, numZBits = 3, padBits = 4
    // z = cc, numZBits = 2, padBits = 5
    // z = c, numZBits = 1, padBits = 6
    // => Pad `z` out to 7 bits using 1s, then encode specially (r = 1)

    while (!(numZBits in lookupE)) {
      z = (z << 1) + 1
      numZBits++
    }

    str += lookupE[numZBits][z]
  }

  return str
}

const decode = str => {
  const length = str.length

  // This length is a guess. There's a chance we allocate one more byte here
  // than we actually need. But we can count and slice it off later
  const uint8Array = new Uint8Array(Math.floor(length * BITS_PER_CHAR / BITS_PER_BYTE))
  let numUint8s = 0
  let uint8 = 0
  let numUint8Bits = 0

  for (let i = 0; i < length; i++) {
    const chr = str.charAt(i)

    if (!(chr in lookupD)) {
      throw new Error(`Unrecognised Base32768 character: ${chr}`)
    }

    const [numZBits, z] = lookupD[chr]

    if (numZBits !== BITS_PER_CHAR && i !== length - 1) {
      throw new Error('Secondary character found before end of input at position ' + String(i))
    }

    // Take most significant bit first
    for (let j = numZBits - 1; j >= 0; j--) {
      const bit = (z >> j) & 1

      uint8 = (uint8 << 1) + bit
      numUint8Bits++

      if (numUint8Bits === BITS_PER_BYTE) {
        uint8Array[numUint8s] = uint8
        numUint8s++
        uint8 = 0
        numUint8Bits = 0
      }
    }
  }

  // Final padding bits! Requires special consideration!
  // Remember how we always pad with 1s?
  // Note: there could be 0 such bits, check still works though
  if (uint8 !== ((1 << numUint8Bits) - 1)) {
    throw new Error('Padding mismatch')
  }

  return new Uint8Array(uint8Array.buffer, 0, numUint8s)
}




const base32768WASM = "Ԑ茻䙠ҠҪ窕晤ꜟޟ繠癏陦ҫꊥꗀᓿ星暿鉠幗ꊘᆀᑾڠዿ蘿陀ᯀ䨻꒽ꔂ꜀ᒿ蘿陏鹐ᒀ䰽ꗾꜟ星蘿虬Ҡ⪛ҵꗾꜟ无㹀Ҡ宕㙈◀⪲ᛀݢҠ䙀癰癨㙄⪨ᖋᒀ枡ݠ暠䙀▤ᯂᖀᔆځ蚀皠◈▨በ⎤ႠҠ暀㙐▰ҨᖂበҡҠ暠䙠■⪠Ҥብቢ暼ԃᆀ乸ᖀ䡌⚡无盀㙘Ҡ纛晸Ⲛ词帙䒀晠趖䇓谡蹠ᖟ嘏萸玍貦憋忝椨調悗縼铬㱶腛栝礼髅彠㝄剋鷖㦋忱甪钿崐腻㐬噢䛒ꐝ锤迎墓羻牎䲖⥣堝池乯嘏萸玍貦憋忝獄诅ҹ梧䙠ᖐ◸莥⢆䚑㛅淫䵇䡣羰檽䢲梕䓨璢签陵㩙鹥⣾䙀㙀灠⎤䙤♣盠ᘃသᇸ皢㓎䡀㡈䠙ᒁꔃ廰ݰ䥎趇㝐☠ጰԜ㝂㚆㓄ڄ⪧鹭裢☔彰Ⴐ䝎詸▐㐄晨杸憙䋈曨㟗彠㝄䌮馀ዠ朽瓍䡀⛠ݰ橦杸恰ߐ噿蚗⠈䠑誠ᓁᖻ㚠䘀嵲Һᗡ鍄颂⪰ڊҠዠ䁈蠰晦柠ꙁ芰䝎涂Һᖡ鋣သᇸ湠躃┇㧑◔晢习ቱߐ䥎桠䁌ᕸ⎂杨悙■躁┄⪧鹭袠ᓁ⫻䋜檡橱爙ԑቼ鷓㙆㚀键崆睠⚤䔮䙂䛆萼詠䩐稓琈橦䙁㩀⎨月㟇䝀㭆ሼᓱ䛄䍜橠穰樒ᯃꊦ鞀ᐠ汽璮䡡㽀ᘠڀ䡅䛌䍈ވ㹏陻此㜨颀ᐠ桽源㘠䇉ҵደ鳒影ᛐ䥮顡䡈怽負㪁ᇻ䌚玤Ҳ晠盨⢂㺴㙂盀䘀嵴◣砨晪杨憀蚟曎㡀偨蠹譄䡱㙀灠ᒄ䚔♣盠⢃သᇸ皢㓎䡀偨䠙ᒁꔃ廰ᄰ䥎趇㝑潤奎䙲䛇䐜試䩐䇳琈晤邀ݴҬᗀ穱樁ҵᒁꔃ开桽㒄ڔ◣罦ሼᓱ㙂皦㔎䵢㞩Ҥ癠⫢ᐠ汽ᖀ穸▐㐅ተ髒㙂皢㔈㹏陻櫠⢂㺶徙☢䩀㣀ݡ▵ደ骀ᐠ蚟曎㩐樃滠⢂☖䜀无钄ڔ♣耩誤㮁Ⱋ湥亁跗㽀筤⎌駊孰ڊҥዠ偨蠰晪柠ꙁ芰䝎涂Ԋᖡ鋣သᇸ湡亃┇㧑♘晢习ᖑᄰ䥎桠偬ᕸ⎂杨悙□亁┄⪧鹭袠ᠡ⫻䋜檡䩑爙ԉቼ鷓㙅㚀键塠観仠☢㖷㙂㚃啎塠䡈倹贴䡅䛇萨ވ㜗懹ҵቴ鳓孱ᆐ䠮顠塨尽負ᴁល䌚檠驰ꉙҽቺ鷓㙃皢甮崂㚃仠ጰԔ㝅皦㓄ޔ⪧鹭裢☔彰ᑐ䝎詸▐㐄晶杸憙䋈泈㟗彡獤䌮馀㿠朽瓄ᑖ睠䏨晢习㱑ڐ䥎桠⠌ᕸ⎂杨悙■亁┄⪧鹭袠ᄡ⫻䋜檥驱爙ޝቼ鷓㙗皠键塢馱ҹ窠㺁Ⱋ湦◁跗㽀蝤⎌馀⠵□厤ᄔ♫苠䳂㒷忰ᙐ䚮趒ᆓ仠♴䙱䛌萨ᰈ㜧懹߅ቦ鳓㙊胨⇭䡀灨谼晲杮戙湢亀巇㽀倈暾邀ᇠ樽詠婰鈛狠⋂⡶怕☢躁鷒ښᖵ镆䙋䛅䏜鎤䜤☛苠䋂⺷忰ᔐ䞎趖睰捤䔮䙏䛆萼詡驰稓琈檂杯懰ᗐ䟮鶒ݪᖩ鍆邂⛀樽詢䩐鈛狠䫂⡶怕☥溁鷒ޒᖵ镆䙖䛅䏜鎤䞴♫苠哢㒷忰᧰䚮趒Ҳᗥ钠ጡ⏛茨ڈ㙷姹ߍ窠㖪㙖皦啄ᑔ☓萬暺杣憙湫鎤ဆ睡彤奎䙮䛇䐜詥詰䇳狠圴䙋孰ተ䠮顠桨尽負◡ល䌚檣㩐ꉙڥቺ鷓㙌皢甮崂㜒ᖽ钠䂁⍛茨ᓈ㛧姻仨崴䙃䛌萨ڨ㜧懹ҭቦ鳓㙂䃈ይ䡁聨搼暖杭戙湦躁䷇䆑☐晰杹懰ተ䠎鶒ڂᖍ鍆䙏宕□躃㶲Ԛᖹ镆䙇䛁菼詡贂ߛ仠⭂㾷㙃㚃畎塠塨㐙負⥪㙍䃈ވ㟗彠㭄䌮馀ᐠ朽瓄Ԗ睠谈暎杯懰᧰䟮鶒ޚᖩ鍆邂㓠樽詣穰鈛狠惢⡶怕☧溁鷒ဒᖵ镆䙞䛅䏜鎤䠴☛苠擢⺷忰╰䞎趖睱ᇨ暌杹懰ᣐ䠎鶒ޒᖍ鍆䙚孰╺橢䩑爙ډቼ鷓㙉㚀键塡熱ڹ窠㞁Ⱋ湤亁跗㽀此⎌馀ᖵ▧厤န♫苠䓂㒷忰ᕐ䚮趒ԛ仠唴䙎䛌萨ለ㜧懹ԙቦ鳓㙃䃈ᑍ䡀聨谼晶杮戙湢躀巇㽀㯨暄邀㑠樽詣橰鈛狠廢⡶怕☨亁鷒Ⴊᖵ镆䙡䛅䏜鎤䡤☛苠櫢⺷忰☰䞎趖睱Ⳅ䔮䙣䛆萼詤婰稓琈檨杯懰⚰䟮鶒ᄂᖩ鍆邂㣠樽詤穰鈛狠烢⡶怕☩溁鷒ᄒᖵ镆䙦䛅䏜鎤䢴♫苠瓢㒷忰➐䚮趒ߚᗥ钠䆁⏛茨ᓨ㙷姹ڙ窠䦪㙍㚆啄ᇤ☓萬暔杣憙湤玤ዦ睠譤奎䙙䛇䐜詣㩐䇳狠䤔䙡孰▰䠮顢ቨ尽負䚁ល䌚檥ᖐꉙށቺ鷓㙔㚂甮崂㞊ᖽ钠価⍛茨ឈ㛧姻仨笴䙜䛌萨ᔈ㜧懹ڱቦ鳓㙋胨ᘍ䡂硨搼暴杭戙湪溁䷇䆑♌暠杹懰▰䠎鶒Ⴂᖍ鍆䙣宕▧躃㶲ယᖹ镆䙟䛁菼詤䳢ᄳ仠拢㾷㙏㚃畎塡顨㐙負䞪㙔胨ᔨ㟗彠魤䌮馀㓠朽瓄ሆ睡䟨暮杯懰➐䟮鶒ᄚᖩ鍆邂㱠樽詥橰鈛狠绢⡶怕☭亁鷒ᇪᖵ镆䙵䛅䏜鎤䦤☛苠鋢⺷忰⻐䞎趖睱萈暬杹懰✰䠎鶒ᄒᖍ鍆䙩孰⻚橤穱爙ݵቼ鷓㙒皠键塢榱ߕ窠䪁Ⱋ湩◁跗㽁㝄⎌馀㙵▫ⵄዴ♫苠波㒷忰♰䚮趒ရ仠甴䙢䛌萨ᗈ㜧懹ݩቦ鳓㙏䃈ᙍ䡂⠈谼暢杮戙湨亀巇㽀鰈暪邀㯠樽詥婰鈛狠糢⡶怕☬◁鷒ᆂᖵ镆䙰䛅䏜鎤䧄☛苠離⺷忰㑐䞎趖睱譤䔮䙹䛆萼詧㩐稓琈櫔杯懰㓐䟮鶒ሒᖩ鍆邂䏠樽詧婰鈛狠鳢⡶怕☯亁鷒ሪᖵ镆䙽䛅䏜鎤䨢ሙင曀䙪㙔▧詣硡坠櫠䊀ᒠ㳐ᛈᐤҢ晰雩ᴀԈႨ☥亃䷒ފᗕ镆䙕䛃萼鎤Ң晰蛨ꕀԈႪ☯㒤ᄷ⚡ꑭ窠⺪䜌幊㣀洂㛁Ҡ癤⫢䡵☠厤ݲދ仠㪀拊㙆▯鎤Ҳމထ赂䙼怕■亃䷒Ҫᗕ镆䙁䛃萼鎨㽘界䩝窤暀Ҵݢᗈ㳢㚉Ҥ暊駑㙊茺橡㩑稙ԅዪ鷓㙄皡镎崄⻌䨳䡈醂䝐Ҫڀ梃䦑◈晢䙉怘湠响䡀硨逼晴杵戙湢満鷗䆒┏㞑塡寱㞈ҥԀႰᦈ橺䙉㙅䌜䩁㵶睠孤孎䙍䛊萼詡穰戛琉ᔷᙛ譡胨漤ᓂቫ狠ᑢ䙴㙠芼詠㩑騙ҥዦ鷓㙀皢畎崂ݣ仨㼔䡐孰ᓈᎭ䡀睡瀈晲䙱孰ᖈᄤߗ䇉ԉ贴䙐䛍䐈ቨ㞗懹ځቮ鷓宀ꌈ黹隶睱櫠㻂䒷㙆㚄镎塠表倽負⫠ݰⳜ钄Ҳᇣ氭窠曊㝄胨棄ߒݣ琤智駊㙉皦畄ᄔ♋萬暆杧戙胰懿乾隓勨誠⛡㕻湢亂巗㽀䭄㬮馀ᘐڈᆎ嵲ҩԑ襆邀䝵☢玤䜒ݡڍ赂䙐怕▣亃䷒ڪᗕ镆䙍䛃萼鎨䃼㪵䉕粤暀ក淽詡䩑䇻狠㫂⡷忰Ꮘᄄ߇䇉Ԅ晸韓孰㞚檡洂㛁Ԕ暆駑㙉茺橢ᖑ稙ځዪ鷓㙈㚁镎崄㖅処ꔄ醂䝐ᒐ䨎顠表琽負⬁ល茨ᆄݲړ琤晲䙊弙胨♭䡠熱◱窠㙠㷵▣䩅贂ݹڡ窠㩠⋐ᖜ钄ߗ䆑ڑዴ鶀⠠殽铄ᄤ◛萭竣ᇶ洪ښ檣በ灨ꁼ晲杳戙湢亁䷗㽀䫀㪀⬳廰Ꮘᆎ㵶睡氈橴邂⋐ᖈᏎ嵲ݣ琈智杺懰ᓐ䣮鶒ڪᖝ镆邡薥須䚍䡢轠佤捎䙊䛉萼詡䩐稛狠㪀⛀ᰙ芨ᄄ߇⦻仠謴䡌孱ᖈᇤᄧ䇉ڑ贴䙐䛍䐈ቨ㞗懹ځቮ鷓宀非鲕ږ睱廠㻂䒷㙆㚄镎塠表倽負⫠ᘐᏜ钄ݲړ氭窠曊㝄胨棄ߒݣ琤智駊㙉皦畄ᄔ♋萬暆杧戙胰擷嗹些仨蒠⛡㕻湢亂巗㽀䭄㬮馀ᘐᏈᆎ嵲ڑԑ襆邀䝵☢玤䞆睠㛀䴔䙂㙈䃈ᇤᒶ睠盠䚀㦳廰ᖜ鎤ᄤ♳苠仢㮷忰ᛐ䜮鶖硬⡲⪒┋㝈▢溃跒ڒᗍ镆䙊䛅䐜詡䡀潠堭袠⛀ᰘ茺橣⍂㙓仨㺀㥠⠹芨Ꭾ崂ڢᗩ钠⬁⢻茨ᆈ㚷懻佧婅㗡ᒵ滤詠䩑騙ҩዦ鷓㙁㚂畎塠㝀䫀㬦鞀ᘐᏜ响䡂醱▱窤⛀ᯐᛜ钄ᄧ䆑ԅዴ鶀ᘠ殽铄ݴ◛萭竣⭝滙机誢桠䡈ꁼ晨杳戙湡◁䷗㽀㛀ᗀ⡳廰ݨᄮ㵶睡怈橦邂ᛐጨᆎ嵲ڣ琈晴杺懰Ꮠ䣮鶒ڒᖝ镆邡蘶䫶蚍墁杠Ⳅ捎䙃䛉萼詠婰稛狠ᴀዠዹ芨ڄڇ⦻仠蔴䡂孱ᓚ橠衠禱Ԅ晶邀Ꮠᒚ橡硠潠倭袠✓孰ᓐ䦎顠遨簽負ⵁᔻ茺溟啨婰ᦌ橸䙂䛏䐈ڈ㝷懹ҩቴ鷓㙁■詠涗⚠⭀⚂駊㙈䃈曭䡠你仠䄦鞀យ胨ވ㟧彠㭄兎馀ᐠ栽铍䩜尼䈸ߔ䡉㙂㚇畄ڄ☻萬晨杪戙湡ᖀ䡀䇛櫠ᗀᓱ怕▤鎤䙶睰㻀⡀⺳廰ᓜ鎤ڤ♳苠⭂㮷忰ᆐ䜮鶖确奮讠Ꭺ㝅■躃跒Һᗍ镆䙃䛅䐜詠塠㝀㠍袠ዠዸ茺橢洂㙓仨㲀កᒹ芨ގ崂ښᗩ钠⥁⢻茨ᅈ㚷懻佧蘑䬯ᄕ☣䩀䩑騙ҩዦ鷓㙁㚂畎塠㝀⭀⚆鞀ᆐႼ响䡁榱▱窤㒪㙄▢鎤ڢڻ仠⡀┊㙇□橡嶗⚠䀍窠㒁ⴛ湣溂緗㽀彤㔮駊䜕䢴胀洂㚹ұዼ鶀ዠ欽铄ڄ◳萬晨䙂㙁茼䩀䡀䇋琈晸邂ᇵ☡䩁塠駻櫠㴦邀ᐠ泽詠穱创狠⢂┗怕㚷䂸咰冱◌晦松懰ߐ䢮鶒Һᖩ镆䙃㙁□㒮㡀㝀㠅贴䙉孱ݺ檠衠你怭袠㒳孰ᆐ䦎顠塨簽負ᴁᔻ茺溛佾尘䏨橼䙂䛏䐈ڈ㝷懹ҩቴ鷓㙁■詠涗⚠⭀⚂駊㙅䃈曭䡠彠㫀Ⲧ鞀ᐹ胨ဈ㟧彠䍄兎馀ᔠ栽铍䩚鵌䄸Ⲗ䡑㙂㚇畄ڄ☻萬晨杪戙湡ᖀ䡀䇛櫠ᗀᓱ怕▣厤䙶睰䟨普䙚孰ᆈጭ䡀你谈晰䙆㙃茼䩀趖睠䝄孎䙈䛊萼詡ᖐ戛琉ᒧ騘蕢脨梤Ԕ⚓苠⋂㦷忰ߐ䞎鶒ҹҨ晨駑㙁□㑮崂ڻ仨ᙔ䡅㙃湢㒮㡀懻仠⢂䂷㙂皥啎塠偨䐝贴栘给ꞁ⺤䜲Ҳᗹ钠ጡ❛茨ڈ㛧懹Ҩ晦䙄怘湠詠海䆑ԍ窤ᗪ㝃□䩁⏗⚠䠍窠ᴁⴛ湡溂緗㽀㽄㔮駊䜜蚆眀洒㚙ұዼ鶀ዠ欽铄ڄ◳萬晨䙂㙁茼䩀䡀䇋琈晼邂ᇵ☡詠硠姻櫠⣦邀ᔠ泽詠驱创狠㓂┗怕㚣捿ꌠ䆙◘晦松懰ߐ䢮鶒Һᖩ镆䙃㙁□㒮㡀㝀㠅贴䙑孱ݺ檡⍂ԙڱ窠ᰀ⨵□䩃崂ځҸ普駑㙃䌚橡ᖑ稙ԁዪ鷓㙄㚁镎崄㐎鷧䩄醂☰ݰ䨎顠㡈琽負ጡល茨ڄԒԃ琤晦䙄弙胨ጭ䡠䦑▴普䙈怘湡铍䡀偨逼晪杵戙湡亀鷗䆒␇ⵒ峊㝉□◃跒Ԃᗍ镆䙄䛅䐜詠桠㝀㐍袠ዠᇸ茺橡鴂㙛仨⬀កᖹ芨Ⴎ崂Ԓᗩ钠ᴁ⢻茨߈㚷懻佧瘅䫡ޕ☣詠婱騙ҭዦ鷓㙁皢畎塠㽀☠⚆鞀ႰႼ响䡀膱▩窤⏀Ꮠᆜ钄ڗ䆑ҽዴ鶀ᔠ殽铄ڴ◛萭竣ᣕ钾曺檡塠㡈ꁼ晤杳戙湠溁䷗㽀☠ᴀᗳ廰߈ݮ㵶睠怈橨邂ᖵ□詤䳢ԑڹ窠ក㛵▢ᖀ衠懻櫠Ⲧ邀ᖠ泽詡ᖑ创狠㛂┗怕㚮㺝畠㦑◘晨松懰Ⴐ䢮鶒Ԃᖩ镆䙄㙁■铎㡀㝀㐅贴䙑孱ߚ檠硠彠䠍袠┓孰ᄰ䦎顠偨簽負ᠡᔻ茺溟琛㖈㟨檂䙃䛏䐈ڨ㝷懹ҭቴ鷓㙁湠橠涗⚠☠⚂駊㙉䃈暭䡠坠㫀㜦鞀ᖹ胨߈㟧彠㽄兎馀ᒠ栽铍䩙䌗Ꭴ⣔䡒㙁㚇畄Ԅ☻萬晤杪戙湠橠塠䧛櫠ᴀᗱ怕▣鎤䚆睰䋀⡀⇳廰ᄼ鎤ڴ♳苠㓂㮷忰ሐ䜮鶖确秺禰⇪㝇湡◃跒Ԃᗍ镆䙄䛅䐜詠桠㝀㐍袠ዠᇸ茺橡崂㙛仨㜔䙇㙒䃈߄ቦ睠㫀洴䙈㙃□铎㡀姻仠㛂䂷㙄㚅啎塠桨䐝贴栛焴匡鎤䛲Һᗹ钠ᓁ❛茨ڨ㛧懹Ҭ晤䙄怘湠橠海䆑ԙ窤Ꭺ㝂湡詡⏗⚠䐍窠ᠡⴛ湡亂緗㽀㭄㔮駊䜩懝䑠鴒㚱ҩዼ鶀ᄀ欽铄Ԅ◳萬晤䙃㙂䌜䩀塠䧋琈暂邂ድ☡橠硠槻櫠㜦邀ᒠ泽詠話创狠⭂┗怕㚾鬶ꗀ妹◤晨松懰Ⴐ䢮鶒Ԃᖩ镆䙄㙁■铎㡀㝀㐅贴䙒孱ߚ檠顠你䀍袠ᡓ孰ሐ䦎顠恨簽負␁ᔻ茺溛ꆈ␐㯬檄䙃䛏䐈ڨ㝷懹ҭቴ鷓㙁湠橠涗⚠☠⚂駊㙇胨暭䡠榱Ҽ暬邀ᒐ⡚橠硢冱Ԁ晬䙇怘湡瓍䡀桨逼晰杵戙湢◀鷗䆒⍶趍敥寱ᕈڈ㠧彠⚤䴮馀ᄀ棽铄Ԃҹұ赂䙃㙂䊜鎤ޖ睰㟨橪䙇㙄䌜䩀鶖睠㭄孎䙅䛊萼詠穰戛琉ᒡ週鳡脨柄ڄ⚓苠☢㦷忰Ⴐ䞎鶒ԁҨ晦駑㙁■钎崂ڳ仨⍴䡆㙂湢㒮㡀槻仠⭂䂷㙃㚅啎塠塨䐝贴栽铇坠鏄䜢Һᗹ钠ᓁ❛茨ڨ㛧懹Ҭ晤䙄怘湠橠海䆑څ窤Ꭺ㝃湡䩀趗⚠㰍窠␁ⴛ湡躂緗㽀䍄㔮駊䜳鉍䒠䳲㛉ҩዼ鶀ᄀ欽铄Ԅ◳萬晤䙃㙂䌜䩀塠䧋琈暄邂ድ☢ⵄڲᅃ仠⬀凊㙂湩鎤ݢԑҽ赂䙆怕▢◃䷒ڂᗕ镆䙈䛃萼鎨䐏䌞剩粤㡠ዠ淽詠橱䇻狠☢⡷忰Ⴈڄԗ䇉Ҩ晦韓孰ᕚ檠崂㙩Ҽ晰駑㙃茺橠穱稙ҵዪ鷓㙂皡镎崄㘜祿摠醂┰ߐ䨎顠䁈琽負ᓁល茨ڤԂԃ琤晤䙄弙胨ᅍ䡠㦑▸晪䙈怘湢㒭䡀塨逼晬杵戙湡満鷗䆒╣ᄵᒁ孱ᑈڈ㠧彠⚤䴮馀ᄀ棽铄Ԃҹұ赂䙃㙂䊜鎤ဆ睰㟨橮䙅㙃䌜䩀綖睠䍄孎䙇䛊萼詠驰戛琉ᒭᏓ賠胨栤ڄ⚓苠☢㦷忰Ⴐ䞎鶒ԁҨ晦駑㙁■钎崂ݫ仨⍴䡈孰ለ⍭䡀坡蠈晪䙵孰ቨ߄ڷ䇉ҹ贴䙈䛍䐈Ⴈ㞗懹ԁቮ鷓宀袖䇾㙖睰櫠⋂䒷㙁皤镎塠䁈倽負ᒠႰႼ钄Ԃԃ氭窠㢪㝁䃈朄ڲڃ琤普駊㙂皦畄ڔ♋萬晪杧戙胰忽遻癳仨䪀ጡ㕻湠溂巗㽀⚤㬮馀Ⴐ߈ݮ嵲ҹұ襆邀╕☡ⵄ䚢ԉԁ赂䙈怕□溃䷒Ԓᗕ镆䙆䛃萼鎨䆟瑵㩍窤㕠ዠ淽詠橱䇻狠☢⡷忰Ⴈڄԗ䇉Ҩ晦韓孰ᑚ檠崂㙹Ҵ晬駑㙂茺橠驱稙ҽዪ鷓㙃皡镎崄⻜踣㙆邂ᣐߐ䨎顠䁈琽負ᓁល茨ڤԂԃ琤晤䙄弙胨ል䡠㦑◁窠亡Ⱋ湪◁跗㽁䝄⎌馀㡵▬ⵄᓴ☛苠铢⺷忰㐐䞎趖睰廠㔔䙆㙝䃈ބᓶ睠䛀⬀┓廰ᆜ鎤ݤ♳苠㛂㮷忰ተ䜮鶖确决汌ᗪ㝋■溃跒Ҳᗍ镆䙂䛅䐜詠䡀㽀㠍袠ᒠዸ茺橢㳢㙣仨⡀⏀ᖹ芨ဎ崂Ԋᗩ钠ᠡ⢻茨ވ㚷懻佧䕩騼ᐵ☤䩀橱騙ұዦ鷓㙂㚂畎塠䝀☠⎆鞀Ⴐߜ响䡁㦑▭窤ᰀᏐቼ钄ݧ䆑ҹዴ鶀ᒠ殽铄ڤ◛萭竣騿荀柺檢䡀䁈ꁼ晦杳戙湠躁䷗㽀⭀ᗀᗳ廰ݨݮ㵶睠搈橤邂ᔐᄨߎ嵲ԋ琈普杺懰ሐ䣮鶒Ԛᖝ镆邡鶢阉ဍ䡡彠⚤捎䙂䛉萼詠䩐稛狠ᗀᒠዹ芨ڤڇ⦻仠㴔䡄孱ቺ橥䩑爙މቼ鷓㙕㚀键塢妱စ窠価Ⱋ湪亁跗㽁䭄⎌馀㣵▮ⵄင☛苠䋂⺷忰ᔐ䞎趖睰卤䔮䙋䛆萼詡婰稓琈橾䙇孰ᆈ╍䡀你合晰䙆㙃茼䩀趖睠䝄孎䙈䛊萼詡ᖐ戛琉ᕟ泵裣胨朄ڄ⚓苠☢㦷忰Ⴐ䞎鶒ԁҨ晦駑㙁■钎崂ޓ仨⍴䡆㙃湢㒮㡀懻仠⭂䂷㙃㚅啎塠塨䐝贴桌湏岡鏄䞢Һᗹ钠ᓁ❛茨ڨ㛧懹Ҭ晤䙄怘湠橠海䆑څ窤Ꭺ㝃湡橡⏗⚠䠍窠␁ⴛ湡躂緗㽀䍄㔮駊䜼敘馀鴒㛉ҩዼ鶀ᄀ欽铄Ԅ◳萬晤䙃㙂䌜䩀塠䧋琈暄邂ድ☢ᖀ衠懻櫠Ⲧ邀ᖠ泽詡ᖑ创狠㛂┗怕㚡癰瘀妹◨晨松懰Ⴐ䢮鶒Ԃᖩ镆䙄㙁■铎㡀㝀㐅贴䙗孱ߚ檡塤䆑繨庠Ԁ䡐ߐ䨎顠䁈琽負ᓁល茨ڤԂԃ琤晤䙄弙胨ލ䡠㡈ꁼ晤杳戙湠溁䷗㽀☠ᴀᗳ廰߈ݮ㵶睠耈橨松懰Ⴐ䢮鶒Ԃᖩ镆䙄㙁■铎㡀㝀㐅贴䙑孱ߐ䨎顠䁈琽負ᓁល茨ڤԂԃ琤晤䙄弙胨ጭ䡠冱繨㺀Ԁ䗐ݨᡈ㟗彡卤䌮馀㯠朽瓄Ꮆ睡逈晾杯懰ᕐ䟮鶒ںᖩ鍆邂┰ᆚ橡塠彠䠍袠┓孰ᑐ䦎顠聨簽負⥁ᔻ茺溒胋鵈㯬橤邂ᒵ⻀楤Ңቩҵዼ鶀ᐠ欽铄ڔ◳萬晪䙃㙂䌜䩀塠䧋琈晤邂ᄕ⻀杤Ңሡތ暸杹懰⤐䠎鶒ᅂᖍ鍆邀⏕▯溁鷒ሲᖵ镆䙾䛅䏜鎤ڶ睠㻀㚀⥳廰ቼ鎤ڤ♳苠⭂㮷忰ᆐ䜮鶖硬䴢奰ᗫ㝃湡ⵄ䚆砐◰晠䙴㙁㚇畄Ԅ☻萬晤杪戙湠橠塠击櫠ᴀᡑ怕□鎤䚶砐▰晠䙬㙘㚆啄ᒄ☓萬曀杣憙胨┍䡀ꂨ搼晾杭戙湣躁䷇䆑ԁ窠ᖠᒐᑜ钄ޗ䆑ұዴ鶀ዠ殽铄ڄ◛萭竣㓎菆ߚ誠桠㽀簉竌ተ㙀■䩀顠㝀㰍袠ዠᐸ茺橠驱騙ҽዦ鷓㙃皢畎崂ԃ伸ᖀ⦥㛁ᕟ蚏袐ቨ栌橶䩀ᄀݰڈԄҲݠݣ魡䷢㙐䝈㛁ᆉᖙየ杨▸溡亂ᖐ曡櫤Ꮒځ◀桤ᰈ㙧䦙▩ᒁڼ㙀湡䩀贆禺᧽裢ᓫ㝀湠䩀䫱罠ᄔ䁊䙀䛂䃐䝂ᒒ◂┒䯀ԈႠ㞃䛈㙂ԃ勤ᯄꛁҰႰ噠䫐蹠轤撠ᗁꡟꞁ迁癡睠㝄⬀ᗁᖻ䀈晭巄▫櫠ݢᅔ尀痺柄䚤△睧Ⴟ晠孴ݠᗀ㪐䡂ᖀ桠杠㛂楠柄ڂԐ朝躢␁Ұ晰䙄㚐䁀⚠晢㚆㝁□⛁癢ұұ粤ዠᇧ榠ᖀ㡐你☨ᯚځҰ木Ԅ㙀蚀勠Ꮒ㪪㩁Ҩ暤ҢұҤ普杽憀杼厨㝆瞠■橢浻㙀■槄㙂Ԛᖅ躢⏀ݦ晢蟠㛴☡ҡቨ邡◀桤ᰈ㚖罠ᄌ峢▰㻐杰慲剠ᄠ■橢䙄䛁菨普袀㡈㐄☠ጠ㙁㚟铈㙗⚠ᇨ橦杣恱Ұ慲⪠ᓑ䙈ڄᠡᖵ⠀晤䙢Ң␂䟀ڪ㝀㠁▤Ԃҡ繨㺀ԀႻݢᆀ㛴㔄煠ڀᄡ数ߝ钆蚀ڙҴ晦杣恨⤈ނᚲ▸噴㲀ᗁ隩噠ᛀ䙄軈⪩Ҥ晢䙁㙀湠䩂Ҳ㩑ݣ苲虠⠀晤䙄仈仠Ԁ擈䛁䍐幱ꊠᓑ䙈ڄႰ䥐Ⴚ誀塠☡廨Ҩ晣䙐Ҥ♤چ罰☠ᴀዠᇤ滠槄㙲ҡҤ晤䅡ݰҤ᧤䙀蹠劌晢䙄◆溡䩀㝀表杤㙠垀ᇥ榠橠㡀䛂ݠ⡀ᒐ㹠麄繠Ꮐ㙁■䁂⪥ᣁ㙐䙤Ҥ⚛櫨ဈ㙴㙁■㓎㝃馡▩ቦ骂Ԁ鲄㹀⍂晰ݨ⋂☊㩁Ҩ暄Ҥ㓄楠ߔ䡀䧂㙈Ԅң噰因ڀᄖႤᒀ䞨䏉㱀Ⴇ垅晠㩁Ұ嘤ԇ懩繨Ҷ䙃㙂ᖐᖀ塠䛂嫨⡀ጡᇺ□⺤䙡ᆂ┢䯀ԈႠ☠ᇠ䜀㺙ҡᑰ鞡躨噠ⵄ㚴㖄煠ڐበ㛃ݿ躛⛌ҡ䙈ڄጡݰҰ䚮趢㙃橱ڀ⏈Ⴄᒀ䞨䏉㱀ݠڀᎲ䅁Ҩခ塰Ⴀ䋀⬬ቨ㙀□洠䜂ԑҼ鉤⫠ᒐҭ暡߀㺙Ҥ晦䙄孨⤃ڡ塠ቫ蠥ᔡ㜀ԕ◡躝⛌ҡ䙈ڂᯂ昀鲄繠Ꮐ㙁▥ቢ䙀䛁菽ᗀ⎰䡁Ҽ癤▬ݥ盖㢘Ңҡҥ諌በ㙃椨䙄ڲԑ繨㚀Ԁᒛݣᖀ衠怐◐晬䙀䅁ቢ躝⛌ҡҴ鉤ځ隩噠ᖀ䦠㙁Ҭ䛞䝃ᯃᑐ捲剠Ⴀ㬘ᖀ桀激Ҩڦ蚀ڙҤ䛞䡃䣆朣ݡ塠Ⴀ㰉⠈暡Ұ枰䙤ڧ䛁睧待晠㩁Ҽ䪀ᗐ蹹Ҡ䚼躡ᄚ㚰㠸Ҧ瞠■桠⤠Ԃ榠䞠婢ҡҴ晠㚆㝀湡➤Ҳԃ勨ᗀᓉ廱چ誀硠㝀⭀ዶ䝃㙀ᖋ檠ߐژ勠⢊Ⳁ㙂㚸㢘Ң晰ݨݺ䙃㙀□⺩鵰蹡Ҵ晨㚍㛃□䡁暄ቨ杤㙠垀ᇦ杰ᖀ硠䛂ݠ⬀ᒐ㹐ߐ噠䬰䡁Ҹ晦㙍ᯁᑈڨ㷇⠎梣Ҡ邁Ⴁ䘐慲剠ᄠ■橢条㙁皠键梀ᔈ㝀晤乢ᖆڂ躛⛌ҡҠ晢颖Ⴀ■柄㙂ұҸ鉤◀Ұᆍ暡桠坠♸ᖘ䙆㙀⻀条晰罠㫀ᴀᗪ▶ᑈނᚲ㙘婤㱄晢䙁㙀湠䩀㡀⚠晨桀激Ҫڀዠጸ㝀晨桄激ҪڀዠᎸ㝁ተ杨▸湡ⵈ㞄◠朥竢㚁ᖈ⬚源■䛁櫨ݢ㚶䙀◠䩁婰ᇰ◀晶杠㙀㚠㙏浲Ҫᨽ⬄һ䅁Ⴈᅈ㙂Ҫᗁ躠һ䅁ҨᅅԀႰ䝔☠杠㛁楢柄ޒ晰䛄㻃雲虠▢譠䚂㚒╢䯀ԈႠ䃈暆蚀ቯ碫Ҡ桔激ҪڀዠႠᘀڀᄫ⻛ݠڈԄቯ墫Ҡ乢Ң㙐干⪠ႨҭڀҰ䛐ቱ栀䡀ᄠ◀橠Ⳁᣆݢ躟澌ҡ䙈ڄڅ㙀▢✎䜐䚠䩬晠㚈⋀■ቩ㡀袘婠晠乢ұݰ揲剠ᄠ■橢獤旰ݨҥԀ䦑ҥ㱊杠ᣆ杢躟澌Ң▒䯀ԈႠ☠ᖁበႠ䝤峌በ㙄▢玤㙔㑄楠ڂҢ䙁㙀蹤Ҳҡ䙈ݮᗀ㙀⠀杤䙀蹨器㱖䙀◄ᓀᖀႤ潠坸䁂⥁鲩噠ᛀ䙂◪⎢䟀ԁҡ㙀蹤ݲҡ䙈ݾᗀ㙀ᖐ䩁㫰蹰勠ڐቨ㝀ᓀᅈ㙂■勠㢀Ұ䛑ᆐ䣈㛁ᆉ◝糢㶫㝀橳誠ᖐ曡櫠ߖ䙁孱ҨҨ㝄◠朤晲邩⻑ᓄ➤㜢کԜ䛚䝀䛄㚂ቦ㡐䁈睤㙠垁ᐠ橰䝂ᒒ▲╒䯀Ԁᖐቤ➤䙔◠朤晢醂ݨ㦈杆蚀ቯ㢋Ҡ䙊䛄䃈ڄԒԋ倈晢郋㝁珠晤ڲҺᖅ諌ቤ䛄㚂ቦ㡐偨睤㙠垁ᄀ橰䝂ᒒ▩Ҽ晦㚍㙀湠橠穰榻倈鉤ᗁꋩ噠◐▨ҩ繨ڀⴀ┨㙐干⪠ᄨ■梀䙎䛄䃐彲⪠ᄨ■鑤Ԁ⎰ᖍ蚠ᖜ諦Ҡ晸屢Ԁ鞄㹀በ砐□ᔁ㜀Ұቭ暠ᖜ櫦Ҡ晼屢ҡ癨Ҩ㚁Ꭹҡቮ屢ቱҰ䛍䡀墨婠㲀⛀⍃ᓂ䩁㡀轠䯬橠䙉㙀ᖓ䡅塠ቬҩ䑈暀ᘐҤᇡ最罠Ⴅ靂栰滀Һ檀䙧ꂮ被Ҡ乢ұڐ䙤Ҥ▻耰橠靤䙐ݪځ߀◺│䯀ԀҰڜ洠䙂Ұ勤ڀዠᘛݢᖀበ瀐◐晲䙂䅁ᒈᄄң噰䙰㡖䙀㩁Ҩ䚤Ңځ繨ڀԀҴݡᖁ䳣噰㛀㙠疂ᐠ桤ᰄ㙢Ҹ果橢杨▸溠ᖁበ㝀㯭窤ᰀቨ㦈䜤ڢԀ杠晦䙀㙀脺檠በ䝀㿩粢ᗁ鲩噠ᛀ䙂Ң䉑ڀځ骩噠ᛀ䙄囈㫀ڐቤ䛁芰䙨霰干ݠԀ沂ᐠ虠灀橢Ҡ暐㹂⤠Ԁ楺歠䙂㙑ҡተ邈Ⴀ☠佀橢ҩҨ鉤⫠Ⴐڍ暡߀◺│䯀ځ銩噠ᛀ䙄⪑ҵቦ鳗廻ݠᅄڂԋ令◠ԀᏈ㦈䙁曐聯墫Ҡ䙇䅁Ұ拲剠ቯ㢋Ҡ乢ҰႺ檠ᓠ㙁Ҽ晠条彻ݡᖀ蝤齨⫰㡖桄激ҨҤچ罰ᙘᖀ桌激Ұ揲剠ᄠ■橤䙄◆滠⍠䙂ҡҥቢ颖Ⴂ■橠杤Ⴀ◡䒂ᒌᖅ盚㢘Ң晰ݤᘂ㚁ᖈ⬈Ҥچ罰ឌ䁆䙂㙂ᖓ䩠ᖞᘖҠ晢屢Ԁꃄ繠በᇰ■晠䙁▸■橠杤Ⴀ◡䒂ᒌᔅ盟㢘Ңځ繨Ҹᖋ㙀■ᛀ䚂ړ伸ᖈ桄激Ҫڀበ禱ᖅᕙ㤀Ҵݠᗀበݢ拨ݢ▰㻐Һ誠Ⴄ轨ⳇ澅晠㙀湠⺤䚓噰Ⴇ羅晠㙁珠晤ԒԊᖅ諌ቤ䛄㚂ቦ㡐㡈睤㙠垁ހ橰䝂ᒒ□Ҭ晪㚍㙀■䩀䩐榻倈鉤ᗁꋩ噠◐▨ҩ繨Ҹᖋ䜴䫰Ҥڳ噰Ⴇ枅晠䜰䫰ҥԀႠ㟨橠屢ҰለҢᒂԐ果桦⪤ᦀꃄ繠ᖐᇰ□ᕁ㤀Ҵݠᖠᖞᘖҡበ屢ҰݨҢᑂҰ果桦⪣ᣐለݤҡᄹұᒀጯዠ□詠杠轠㺁䒂ᒌᆅ湡●⎴㓄楠ߔ䝂ᄟ盖㢘Ң晰ݨᏂᄀዠ朽瓤䙇◂ݠᗐቨᯀ椰慲剠Ⴀݠᑤ屢Ұݢ誀በ㝀䌘ᖐ䙀㙃珠柤ڲұ繨㺀⏀һݢᖀ蝤齨⫰ᖖ柠灀Ұ晃駀㙂⏒䟀Ԁᯛݠ◘潬ҡԈ鉤ځ蚨噠ᖁᓠ㙂┒䟀ځ躨噠⍠䙄㕤楠ݣ绰虠⻀晨䏉ᯀႧ䝡晠䅁Ұ揲⪠ቯጣҠ屢Ԁ麄㹀ᖝ櫦Ҡ鉤ځꃨ噠◝⚬ҡ繨ݣ軰虠㚸㡘ң噰Ⴇ龁晠䜸䩰Ҧ蚀ቯ梣Ҡ案滀ҭ暠ᖘ䫎ҡᕱ㜀һݠ◟⚬Ң╢䟀ԖႠ㚣㡸Ҥ⪤浠ڬበ䜀䪰Ҩ䗉ᯀߘᖀ柴潀Ұ坲䉀ᇰ□ᒑ㠀Ԁ蚄幠ᓠ㙂⇲䧀ځ溨陠⍠䙄⭄浠ݣ☱虠⻀晨㿉㑀Ⴆ䝣晠䅁Ұ嫲䉀ቬ袧Ҡ屢Ԁ躄幠ᖙ櫮Ҡ鉤ځ粨陠◔⚼ҡ繨ݣ仱虠㚨㡸ң噰Ⴆ较晠䜔䪰Ҧ蚀ቭ梧Ҡ栈潀ҭ暠ᖛ諮ҡᓡ㠀һݠ◗⚼Ң⍢䧀ԖႠ㚱㡸Ҥ㐄浠ڬበ䜠䪰Ҩ䇉㑀ߘᖀ栬潀Ұ干䉀ᇰ□ᔑ㠀Ԁ隄幠ᓠ㙂␒䧀ځ誨陠⍠䙄㓄浠ݣ滱虠⻀晨䐉㑀Ⴇ䝣晠䅁Ұ拲䉀ቮ袧Ҡ屢Ԁ鲄幠ᖝᘎҠ鉤ځ鲨陠◜⚼ҡ繨ݣ蛱虠㚶㡸ң噰Ⴇ较晠䜴䪰Ҧ蚀ቯ䢇Ҡ桀潀ҭ暠ᖟ諮ҡᕡ㠀һݠ◞⚼Ң╂䧀ԖႠ㚡㢘Ҥ㘄浠ڬበ䜼䪰Ҩ䕉㑀ߘᖀ柬激Ұ噲剠ᇰ□ᒁ㤀Ԁꔤ幠ᓠ㙂ᴒ䯀ځ檩噠⍠䙄⬄煠ݣݲ虠⻀晨䀉㱀Ⴆ䝥晠䅁Ұ塲剠ቬ䢋Ҡ屢Ԁ辄繠ᖙ櫶Ҡ鉤ځ犩噠◒⛌ҡ繨ݣ勲虠㚨㢘ң噰Ⴆ枅晠䜌䫰Ҧ蚀ቭ碫Ҡ栈激ҭ暠ᖚ櫶ҡᓁ㤀һݠ◗澌Ң⍢䯀ԖႠ㚬㢘Ҥⵄ煠ڬበ䜢䫰Ҩ䇉㱀ߘᖀ栘激Ұ屲剠ᇰ□ᔙ㤀Ԁ隄繠ᓠ㙂⎢䯀ځ芩噠⍠䙄㓤煠ݣ滲虠⻀晨䋉㱀Ⴇᄅ晠䅁Ұ恲剠ቮ䢋Ҡ屢Ԁ桰䝂ᒒ◊ᗑተ㙱㛁㚄◁Ⴃ⚨ᛇ羅晠㙄▢ቩ颀ቨ䚀袠ګ㝀ᖓ䪀姀㙂┲䯀Ԁក桺橠㡀㝀㯩窠ڪ寱ᄭ暠በ㽀㭄ᑤ屢ዠ桰䝂ᒒ▲ᗑተ㙱㛀皤◁Ⴃ⚨ݠᴀᛐ䳐ҨԄԄ◣吉竌ቤ䜼䫰Ҩ㹈ᖀᙘᖀ⥁Ұ朰拲剠ᄠ■橠䙄䳆晰拲剠Ⴀݠ♶䡁䅁Ұ揲剠ቯ墫Ҡ乢ұݨݢᙒ㙁繨ڀԀހ暼洠䚂ұҰ䛀䙂◇溠蟄ޔ☣仰ڀᒋ虩ݨ噀幂㹂⋀㜖䡆㡀□準Ԇ睰䊀嚠ᴁ虣䃈枢ᆂԒ␀⣔䙇䜸Ҥ✤ڤ㒀㯩ᡍ錸网頃姆觐㹁ҹᔀᡊ䞛憖㱼拈錹缼ᯀ䙆䜜ᄺ溶锭毯㕚䅶岗ᆀ□準ږ硵舓埃訦洭班蛀በ塭䙕童嵌銸齑砓姃幸ݠ⭃䙅宁君䅖䑼嫌錸鑦Ԁᒠ象厨凎败淯ⳛ䅶䇁晨߈凎败淯ⳛ䅶䇁詡䩀詻暃佫忑顂褥豋臠ᓰ㹁ҹᓠᗪ䞮咜抸缙揖陠鑦Ԁᒠ遡ⵈ含淯⤖㵯唼һ朠ᖀ詺ԃ佫忑顂褥豋臠ᓰ㹁ҹᒰᗪ䞮咜抸缙揖陠鑦Ԁᒠ詡ⵈ含淯⤖㵯唼һ朠ᖀ詸暃佫忑顂褥豋臠ᓰ㹁ҹᦙ彑韂襅鰻晣幼Ұᘀ䙁䜠晳蛨በ塭晽窤⎰⪰ለҤұݡҹᓠᎪ㝀□躞ҡᎠ軠⭃乡孰Ҥᄨ㙂◘Ⳁ晬柰ᐵ□鎤䙂Ԓ⍀ᑔ䙇孱ቫ䙀ዠ潠ޔҠ馚Ҡ□源چ睠䏨橢䙉㙀熠Ү娀ҡҡቢ邂Ұተ䙭䤐ҡ◀晠占ԙ瓠ҤҴ▫仨ڀ◀Ҷ晠㒧䙀Ⴀ䍄ᙔ䡇䛐㠃䙁圠◹ҥ⠚ځҰ栨Ԉ㙔庂ݠᏂꕱ㛆朰ᖀ詹ԋ仠㔔䡈㙀□鎤䜂蹠ݨ䊀◍Ҡ䌎晠በ塬ұ窠┊㝄湣橡㤐ң獈Ҡ䙈䛀胨杤߄▫伔Ҡ䡌㙄⥀Ү娀ҡԅቢ邂ᖐᒈႥ癠ᔙ蹠ڀⴀᔠ曺檠髐蹠勠ڀ┊㛀ᑈԈ㙗⠨婠晬柰ᐵ□鎤䙒ҡ婠ڄԀݶ晠㒧䙀Ⴀ㽆Ҩ邀ᔵ☠䩀በ✈ҡ賔Ҡᣐᆐ塠紂㙂⎠Ԁ㙠ᛐᆐ噠洄㑀ڀ䚀ᴁ穠胨Ҩ䑀ݢ囈晬桐ԕ☥䩀詸ԓ伄ᯀ嵣Ұᆐ敠⍂㛱ҹᒐ⇪㫁晭蛀በ塬ҥ窤㵠ᒠ詡玥㙰ᇸ⪠晬柨ޕ☦ᖀ詹暓伄ᯀ嵣Ұᆐ塠㳢㜉ҹᓀ⇪㫁晭蛀በ塬虥窤䁠ᒠ遡玥㙰ᇸ⪠晬栀ޕ☦詠詻ԓ伄ᯀ嵣Ұᆐ彠⍂Ԓ⎰Ⲕ佢һ朠ᖀ詽ң仠⭃牦孴曠⎀噢Ԓ─ߔ䙆䜪ᆚ殀䙃幸ݠ⭃虠孰ᆐ懠贂晰ߘᖀ䙆㙃⡀Ꙁ秐䆁Ҹ晬佢董㐀蹤ڢ湿晴梮䙆㩁呡檃桠塨䟨檚䙆䜸ᆚ殀噣幸ݠ⭂㚪㝏□溟ڦ瞨⪠鑦Ԁᒠ決檣顠塬ҽ窲ᒀ䇁晨߈㡆睱ݠ⭃▧孴朠⎀噢Ԓᘡ窤䝠ᒠ詡鎥㙰ᇸ⪠晬析孱☨߈㿀憱䩌ڮᒀ㙃㚎ⵄ䡲Ԓ⋀㔔佣һ朠ᖀ衠垨㗠⬮ᒀ㙂杰ᖀ裰䕀㻄皠ᰈᄴለ䫄ڤ㗀❈梪䙆䜰ߚ檁桠塪ᇭቨ颁⎰ᆐ幠贂☩ҹᕐ⇪㛀□溝Ҷ睨滠⭃鹥孰桨߈䃀䦑ᖤ晬栰ᐵ◢満ተ蹺ݠ☢䙠Ꮠᄰ䩉頒㚘枌梆䙈䛜䃈ᓥ㙰ᇸ⪠晰析孰⋊䚠ᓰ㹁ԁጰ邀⭔朠⎀噢ڂᘁ窠㹩ᆀ㐀虤ݤ♣仠咲ᒀ䇁晨Ⴈ㝆睠缄ᯀ嵣Ұተ䝍䡁侨⪠鑦Ԁᖐᆊ䚭ᓰ㹁Ԉ暄佣һ朠ᖁ䩐榱ډተ邉ᆀ㐀虤ބ☣仠䫂㚪㫁晭蛀በ硨蠈暄杸孴朠⎀噢Ңᚡ窤ᄀ㟔朠⎀噢Ңᙁ窤ᖠ㝔朠⎀噢Ңᘡ窤⏀㛔朠⎀噢Ңᘁ窤㕠㙔朠⎀噢Ңᗡ窤㩠㗔朠⎀噢Ңᗁ窤㙠㕔朠⎀噢Ңᖡ窤䱠㓔朠⎀噢ҡҸ硦ԗᆀ▤䩁裰㙁艨ڀ㞁ᖵ▣溁⍂湰ߜᖀ䙑䛈䃈ለ㝆瞨■鑤Ԁ♀決橡話榱䩈ڮበ㙃㚦ލ䡀塭晥窲ᒀ䇁晨߈䁀冱ҹᓰᅊ㫁晭蛀በ塭䙕窠ᴁ虠胪䚠ᓰ㹁ҹᓠᡊ㙃㚲ԍ䣐㹁艬ڀᴁ艢胨߈䍀⥑䩌ڮᒀ㙃㚰ލ䡀塮虥窲ᒀ䇁晨߈䋀冱ҹᕀᅊ㫁晭蛀በ坠霸ᡐᰀᒐ➍蛞ڒԑҸ硧乡䇁詡䩀衢䟰⢠㒀ᰀ㩛杘߄ނұҬ䙠䙆㙆皠厤䜔♣盠䃃သᇸ皢㓎䡀遨䠙ᒁꔃ廰ᓐ䥎趇㟰⠰ᗀ⠠ᒠ襠玨㚁ݡҹᓠᎪ㙃㚤ލ䩝Ҩ析媠ᰉሰᆈ䭤ݴ➃仠ጲᒀ䇁晨ᄈ㥆睠㛤ᯀ嵣Ұጰ䭍䡀徨⪠鑦Ԁᘠ湺橡飰㹁艬ڀ⛡⫵▥ក噣幸ݠ㣂㚪㙈⡀虦隐Ⴀ䭄㜔䙦㫁晭蛀በ潠ބᯀ嵣Ұᆐ坠洂ڢᖡ窲ᒀ䇁晨߈㽀䦑ԑዠ邉ᆀ㐀虤ڤⲀ㟨晸杸孴朠⎀噢ԑԐ硦ԗሀႨ߄ڢ晵䙜鉥蹤㙃▪䴠恠䝀㽆虮邂ݰ⛰摠Ⴄ蜱ҹᕠᗪ㝂■䡁䡀塬ұ窤⏀ዠ湤ቤҲԚ╠Ԁ牺㙂湢鏄㚒Ԓᴀᙔ䙁▥ݰᖁ媰蹡ԍቦ鞁ዠ晨䙤ޔ◂扱ڀ⥁䑸溥ڨበ⚠琈橮䙇㳀Ҩ߈㽀㦑ҥ窤㕭Ҡ䌎晠በ恨ᦈ檀䙐㳀Ҩረ㙖矈ҡ賔Ҡ㙃皠玤䝂ݡ婠ڀ㖁ᄕ⥀Ү娀ҡҽቦ邂ᔐላ䙀በꂨ㇈聠ڳ䍀ҨᏄҴ◃仨ᏎⳀᣅ湡♁癢ҩڍ窢⏀ᒠ詠玤Ҷ睨ᖍڀ⏀ᔖ晠ᖀ㤐ң獈Ҡ䙇䛀胨䜤Ҵ▫令ጠᗁޕ满ᇠސ罠勠䴔䝄㙂榠ᅁ塠塭ԁ窨ҫ絥ڇ附噤⪠ᦌ橨䩀㙀皰ⵄ㚐㡀⚠晢枟䯂㙈ݨ㧆睰軠ڀᡊ㝂皮ⵅ㙀ᇸ⪠晨析孱⍨ވ㥆瞨Ҡ鑦Ԁዠ灺檣桠偩䟨硠ԗᆀ□◄⍂㜩ҵጠ邉Ҡ㐀虤ڄ♣仨抠ᠡ⫵⡀Ҧ隐Ⴀ㝄䜔䡟㙂皤ⵅ㙀ᇸ⪠晨杨孱▨ވ㛆瞨Ҡ鑦Ԁተᄪ䙀ᓰ㹁ұᕰڪ䝀㐀虤ڄ㗀ᇩᖀ嵣ҰႰ捠⍄㙁艬ڀᗁ陠䃐晦隐Ⴀ㝇噠邢һ朠ᖀ橽ң佨ڮᒀ㙂㚲ҭ䩠ᇸ⪠晨桠䇁癨Ԉ㙗坩ᖍݣ晠㙀湠亘Ҥ鼹▹ቢ鞡Ұ枨߈㙔庂ݠ⭃ꔀ廰桠蹤ڄ⠃勠⣔䡊㙀□厤䛒蹠ݠ◠ᡊ㝅熠Ү娀ҡԉቢ邀ᘠ暺氀Ңښᖅ窺Ҡ忽Ҡᖁበ偨❈橪浭ҥ椡▤ڄ⠃勠⣔䙀㙂胫䙀በ䝀㯨聠ڳ䍀Ң詠㡀妹ᖄ晠䙆孰晰䛄㞲ԁ䙉麢កቴݾᖢ桠䞀➐梆䙄㩁䉈䜄ڂ晳囤㒀ᖨᄔ◢ᖀ棠㥡ᗔ晨乢噰檨ݥԅ蝨嫠◰ጸ㛅□ᛀ䮂◩Ұ癤皁⎰Ⴊډ桰齠㛠ᘐ䝐㙂⠀滤㛲ԁ䙉ڂ⪣䙐ጨᅍ䩐戙ڕ貤㱠ᘵ㚂啄ᄗ㽐蛠⬀⬪䛃萨ሎ墀靠堉ቲ鶀♙滦䩁贄☋苠Ⲧ䡢㙂湡鎨㚷彠搬橾䙅宀梽詡綒㚩ԝ竢⺷㙃茨梄ߖ硨瀼晪馂Ꮠቨᄭ䩐戙ڑ貤┊䛃萼誠衠冲ᖥ镆䡓㙃䃐䟮顠懹◰暆邡⛛湡哄㚒ԙҼ晰邡ᘻ湤㒤䝆硨尼晴馂ᛐᖚ溂䷒ڃ狨㚀㲪䛃萨ዮ墀彠䟩ቲ鶀Ⱉ滤䩀鴄☋苠卆䡕㙈胰䢎顠槹ᖠ暐䙖㙌䃐䟮顠臹◍竢㢷㙄茨构ဆ硨䐜晴馂ᛐጺ溁㶲ګ狨䂀⡪䛆萨ሎ墀靠尉ዤ鶀ᘹ溢䩁顡潡❉ዤ鶀ᰙ滣ⵈ㚷彠听橶䙌宀梽詢⏒㛁ԍ竢⺷㙇茨桄Ⴆ硨瀼晸馁ᯐ᧰䙭墁廈Ԍ晨䙄㩁㙈ᆍ䦠㙁Ұ晨乢䡐ᑚ洠䚂ԁҰ癤満◕⻀杤ڂԁ䙉㺀㖪䅁ᒈݤڂ晲曠䌔屢▰Ⴈݥԅ䝀䯨鉤㩠ተႪڋበ禱繨嚠ᖠቴݷᖁ紃噰雠◠ᖨᄐ▤厦蚂Ⴀ㛀◰Ꭴ㙊胭暤桠䝀㛠ᙐ䙈孻ݪᖀ桠䞀❐普邖Ⴖ□ᖀ棠㧁ҹ竌ደ㙂□ᛀ䶂ݻ伸ᗨ䙄㙂⠀畤ᄦ砐⚀晨䙄㩁䕈ލ䦠㠢ᖀ暄条引湨咄ᄄ○睥ဂ邂ᐠ発誀衠偭꒽㱚ዠᆐᆒ䟠塠㝀㯨橪䙄㫁晭虠በ偩蠈暔佣һ晠ᖀ穳ᓑڬ硦ԗҠ□亅⍂ခ䩌ڮҠ㙂皨ⵄሒ湸ߜҠ䙅䛌䃈ᕅ㙰ᇸҠ晪杰孰╪䚠ᓰҡҵተ邀㙔朠⎀Ңݲᖅ窢㡠ݦ晢詠橸ҫ仰Ҿ⤠Ꮠڐ埰牠ݠ鉠㲀កᒠ趁㹀Ⴁ蹠勠⬀ᓁ璢噠ባ晠葰牨慞ᅞ㟀㚴ҭ墀澀Ⴆ⤟晠㳀Ҧ暨ԄҲҩҤ晢䙠椰䙢ᓢ㛠㝀暈杧宀誀繠Ꮐҡ繠ڀ㪁次噠កң幠ҩҤ晢䙁㙀湠䩄⚙ҵ甶䡋䜿暼䩀詰䧢䩑ڀᴅ⋀湡鰈副ꡟꡜᴀ⍍䝃蠀⣁眒ڀ婩ቢ䝑ᯁ椰圑ꊠᅈҠ嫢⛡ݨ⻈月眰你㭄㜔桙柀ҫ䙀ᔠҡҵᕣᑀҴ晠⎀Ҡ蚸卧蝣晠䛌盈㚘ҡႸԌ晰杠䩆曰圑ꊠᅈҠ媠◡ݨ⻈梈眰⚠櫠㙠煺ᣐጰ䵍䡠乳ꎤጠᴅ㙅盟蚎㡠硨ꏍ誠␅㙃㚿ꡟ靔至溔Ԕ条㙃㚁铵碂塨ᘀ㬩叞䝐䡩詤衠揋齨東䷒㙃㚁㓄ބ轠㻀㔘桟ꡟꞀ迎䵠蹠軠⡀ᰖႢ□亁洂ڙ蹠ڀᠡᖵ□贠䙄■匸ᖀ䙉㩁㑃䜄ݴ☣仠㣃橠孴ݠ⍠䙂ډԄ硤抗ᆄ▢亇⍂ҩҨ䙐䙉㩁㑈楈眰坠䫠ᘀ䝚㙄灠淤㟲ڊᚡ窠ᒠቨቨᄅԃ杰靴䁊䙉㩁㕈ᄅԄႨ仠㣂☊㛂漠◄⍒㛑㙀ᘀ䙈䣆晨ޅ癠杨㽄ጢ⎢䙁㙀湠䩀㡀⚠晪乢Ԁ栽ᗁ顠侠▱纤⤄䙐ᑐ䙉ߐ⚠加钤␅⋁ᑈᑤᇢခԈ普䙋□㚀䩠硠齠䀐橼ᗀ㙇㚀⚡癲ڰ朼橪歭ᆅ湣輁皢ںᖁ㙚Ԁ┨㐈椈眰㽀却☠杠㛃ᒁ柈㙒ԓ盤暠⏁▰ᑈ䜀婢Ⴁᗙበ䝘㟀㚈⺤䝲䙀⚠ᘀ䙆㙇湡橡髱罰噱ڀ㒅⋁▣檁䡀佨媐ቶ䙓䛊䃐晦隀Ⴀ獤Ꭼቬ㙉益㚸ң噰䛀䳃⭃虠⻀桤ᄔ◣佧Ⴋ晠△晢蛈በ睠垜☠䙍㙈▣ቩ梀轠因䚀⪰ᆐᒈᇭ䡐轠仠㼖䡊⋀楠柁婺誆ҡጰ栐楀Ҥᗠސ㡀⚠ᘀጠᄀ▥漁癢ڢᚱ粤⠠ᰀ発檡竰蹨⚠晸果䷢㙈ᑈ㙖罨髠䂀㚪㛏▣詡桠蝠掌岤㽍ݡ癨ᕅҠႠ鰤橺条孰ᒛᗁ䡀蝠尐橺潭ᏐᏈሉ地坠章䒀㙠ᯈ߈ᑈ㙖罰纔Ҷ⪢ᣐᏈᆈ䑈呠ڀ幠⤠Ⰰ藼䩤㡁灨᧤梤ᓀ㙏⠀Ҥሗ⚰孤ᑔ䙌山Ꮘᆄߖ蝰宄䁆䙊㙇㤃䛄ڒګ令䃂ԁᛐᴐ䙨隤Һݠ㪀㮪㝑湢橡紂㝡婠ڀ⠠◕☩䯠ҧ䀐Ҡ暦条孰⚰䙭䤐ҡݵቢ邍Ҡ䌎晠ቢ⚠佤ᙔ䡊䧆晢蟄ᆄ▫令嚠䡄䙐Ꮘᐭ䡀睠專聠Ԁᛐᖚ氀ҧ䀐Ҡ㲀㭠┰ᖈᆂԒޑڡ㑚ҫᣐᙐ䩍䢀ڠ⫬智䙊䜰䞰ҢሐڙԔ晴栰楀Ҥᔠޒڑԙᔡ᧠Ҩ⎠ᅄ߂ݣ令䚀ᰀᰕ满栀ޒڙᖘ㹊⤐㥀ᑐ䙤ޑጰԍቢ䙎◅Ң躀㡀黢习㲀㢁⠵㛀⎀䙂ݲᖄ鉤⫠⛀要繠ᓠ㚁ډᕡ᧠һݤᖂ䩐榲╒⻀Ұ㧀ᑈᑤᇢԙҸ暂䙈□▥䡀硠隂ݠ⠠ᛋ㙅瞣䙄ڱԈ勠䫂䚪㡀▢♁皢ڊᘡ窤ᠡ暠噠⍠䜂ԉڄ鉤ᖠᐠ蚀㻀ᓠ㙁ҵተ邂ᔐቨይ䦠㙁ԅበ屢㙐ጰ暆隑杠䭄霴䡆䛀珠曤ڤ◣仠㒐በ㙂皡ⵅԀᓚᖅ躠ឈႠ㚠㙘晤懱▴鉤Ԁᒐᄭ暠በ澠⚀橪ᗀ㙄皦ⵈ㙂Ԉ暬㲀⛡䙵湢了⍂湸ߜᯀ䙉㙄炠警隓杠䭄霴㙟㝃㚠㙘晤庂ҭҤ晢旡㙈߈㹀⡸㝀晲杠䅁㥈߈㹁ጨ婤晬柠晢㢁▤ݲԒᚽ裣ҡ彽ҳ橡㡀塨堹ᕀᅒ䍀㥈ᄄڤ◓罤ꗢ柠ޙ㓀❈㙰虸勠㢀ᴁ䗸盀Ԏ䧠ᎹԄ晬杲憀ꊠ咧䙄蝠䫀⭂⇶䛟芰噠㵣癢廠㢀ᴁᰛ㚏针㹀⦱蹡䃂ᖌႥ湢䭀䡂㚙Ԅ癤䊆ዿ湢亃⍂◙⪡ጠ醂ᏒҠ湠䩂ښᖅ窤⥅⋀㚂ᖀ驰䦑䙈ڄ⡁ޚ☣橡塠罠径岤⤠ᦀ桳䦤䜤⪛獤敌䝋ᄀ▢曨በ你伸ᖰ䙅䛀珠棤ڒԙ䙈ڬተᯀ椨ވ㙃噰皌晪䙋㙇□亂⍁ݱҴ癤ᖡᣐᄪڀᗐ䡁Ҽ晶屢Ұሐ䛍䡀預■㹄⤠ᦀ蛀㙐┤囈ᘀ㳊Ⳁ㙅湡亁⍂晰ځ㩀⤐㥀ᑈވ㡆瞀ݠ㢐ዠᏐᑂ詡㣀㜃仠⬴Ҡ㙄湢䭀䡄▫伸ᗀ⪢ᣐጨ߈㨷⠌ҥ諔ڍ㙄湡満跄㑀᧨驠犡Ⴅ溡䩀硠澠☐晲乢㙑ᆚ迀湒ڊᗡ窠ᰀᏈᙈᄅԂԉҸ㲀⛈Ⴌ䃈ᄈ䌀ᓑҴ䛘䁠ᘐጪڄበ冱繨晶䙉䛜䃄ᕤ䚤⪤ᒐݮⳀᣅ湢䭀䟂◉Ԅ癤䉡ᔐጪڄተ坠䙑ڀ㝐Ꮕ杰ᖃ杠亹ڬ☠䙗▢椨Ꮒڐ蚨卤ጠ▰䭀ᑄᙀޔ▪ᖤ䛔ҫ䛀皢衩䙀罸Ⴅߔ䡀㡀■◂觀㚡ҡᓡᑀһݢᖀᖜ橶Ҡ鉤㩠Ұጰ䵍䦠㛁ҡጨ邢Ⴛ曠ᖀᖓ覲ᗐ鉤ԀԀ曭暣桠ቬ碓Ҡ屢⪰Ұ䣦蚃䝀ݠݢ囊䅁▨ҤҤ☣伸ᗰ䙀㙀㚂ⵆ蚃ႠႤ圴核柀Ҥᚠޒߚ㩴ڀ㵐Ꮕ皢誀顠暂ݠ䡠ᛋ㙊◡亁塰囀◍ᒋ㘀Ҷ晠ᓈ㛔▨朸橪ᗀ㙂皢ⵈ䕈㱀ޔҠ恠Ұᄰ捰剠ᄨҠ鑠Ҭݥ皠亁㝄癠勠亀ᠡᘐ栰䝤㚠罠㙑ڀᒐᏅ湠曨በ☠㩬ᘀጠ㙃□遀橢ԉᖄ㹂⤠ᒢ杰◀㡐⚠㪀⠘Ⴋ㙂湡躀㡀囡滨ᏊⳁᣐҨ߆蚀䝀ݠᎬበ㙄盔ҭ䢀ڸ卤ጠᯐ䭀ᑤ䜠㚗齠ځ䚄ԀҨ㟈暂ᙒ▰⚠ᘀ䙀◃榠ᖀᏀ㙁ᖌ晠㙿䣂㙈ԄԖ睨ᘀڀᒐ䵑Ұ捲剠ᄠ□⪨暀Ⴔݡ◀嵴►䉴ᘃ蛲虠■䴀䙂ҡҤ晤㙫┥湠躐Ԅ麂ݠԀ⪬Ⴅ湠◁洂晰ݨ◠ځᖵ⠀晤䚔庂ݠ⡀ᖶႦ□ᖀ秀㚀器㳃绲虠㚶㢘Ң晰Ⴅꋠᓁᇻ䐜䴀䙀虨勠ጠᓪ䛈䃈䙁晰繲ݠᖠ扤䙐ҨԄԁᄸ噤㱄晢䙁㙐揲剠ᄠ■晤浤䙐ݰ捲剠ᄠ□⪺ᄀႨ㟈曄Ҷ睨ᖉڀᓁ晡㨁▤ԁڠ噤㲀ጡᰕ⠀晤䚂Ҳᖡ窰በ㝁㠁▤Ԃԁ繨㺀ᖠႻݢᆀ㛴㔄煠ݣ绲虠⠀晨㸢Һᖍ鍎鞖ႠᑈҤұᆁҡᕑ㤀Ҵݠ⚁皤㕄煠ڀᄖႠᕂ躝澌ҡҠ鉤ځ颩噠◜澌ҡ䙈ڀᅊ㝁⻀晤ҢҲᖅ諌ቤ㙀㚺㢘Ң晰Ⴘ䁂⪢ᦀꃄ繠በᇰ□ᕁ㤀Ԁ麄繠Ꮐ㙁ҥ窤ዶႠ■ᖀ䝃ڸ卧枅晠䛀⻀晨䓉㱀Ⴄڬበᣐݰ敲剠ᄠ□䁚ᄡᖠ桤ᰄ㙄♂ᖠ䚢䝂䛈㚂ቦ㡐䁈Ⴄ䛂▰㻠曽⺤䙔⪤ሰ晦䙀㙁䃚珈㶷⠈㇌橠䙀㙀礦輁癴㖤煠ڐበ䣆暰䝈㛁ᆉᖁየ杨▸溠溂ᖐ曡櫤Ꮒԁᆁ㙐拲剠ᄠ■橨䙁㙁■◁⍖禱□䁚ԀተҺ躟ꡐ䆒ᯂဘ鞂ዠ蚀ݭ塰㡏墫Ҡ乢Ұ暰干⪠ႨҩҦ暀ݰҪڀᚰ䡁Ҡ䛂䙁䯆曢詠Ꮐ㚁■䁀⥁Ұ晢詠Ⴄ曈ݠڐቬⳆҢ衡詰Ⴀ㇍㑚ᄡ颩噠ᛀ䙄㘄煠ڐበ䳆暰敲剠ቫꍸᖀ㕋㙀盀ډ隤Ⴀݠዠⵁ暩陠◐⛜ҡ䙈ݢᅋ㝀⻀晤Ҡ蹨暘婾⤠ހ葼亚⚬ң令ᖄꛁ銩噠ᛀ䙂㙚ᖄ晢杣憚☠咀橢ұ䙈㙘Ⴋ䜬䫰ҤҲһ漸ᖀ䙂ᣐ木ڄң噰䛀ᴀԖႦ■ᖀ䦠㚡Ҡ晦屢ᖅ楁最㛷齸Ⴄ蜶䡂㡀■溄⍄㖤䥀ڬበ㙁㚀趠ᏂҲᘀ鉤㹠ᄀ晭暤桠㝀ߘᖸ䙂䛀⻀桤Ԅ□繨㙄Ꙃ䙁㙈ԅԁႰ佴☠䙁䛆䃊ڀዠየ婤晢乢ᖐ木Ҩ㙷䝈㫀ݢᅋ䜿ꡟꡀ㵔▫令㒀ᄈႠ◠ڨበቨ㟨癤Ԃቢ㙈څԁ蝠ހᖀ䙄㙁⠀橥Ԁ蛨⪠䁈⤠ᆔݠᖀ䩐榱ҭቨ邈Ⴀᗀҡ皒Һᖡ窢ᒠԀ桺檀በ偨䟬橪Ⳁᣆڂ詠㩑䦑䙈ڄڅ⋀■◀綢◹ҡቢ醡ꡟꞏ针㙖睨䋀ጰበ㛀ߐᖀᖐ䦑䙈ڄᒄ䙐ݪڃ桠ᄠ■晦䙂㩁▪ځ杰㹀婬㲀ዠᏐᏚ檠婱ᓑ䙈ڬቸ㙁■躃洂蹠ဈڐ䙂㙁皦ⵅԀᇰ☰晦杬孴ݠᖠ衠⛠◀桰杠㛄皠ᖠ暄Ҳҩڀᓁᖵ⠀晨㙖绐■ᖂ⤠ᒠ朽ᖁ⍂㚡䙈☢㦇⋀湣ᛀ䙂晰ݤ⪶条㛂ᑈڄڣ噰因ᗀᖶႤ■躀洂晰ݤ▤晢䙁㙈ڥԀቨᦌ䉄Ңݥ湡◀嶢ڃ仨⬐ቤ䛉砣䙤ڢ晰ހᖀ䝄ᦀ暨䝡塠㝀㜘ᖨ䙂㙄珠桤ݢҺᗑ窰በ䛁荺檠壠㙁ҩተ邀ᆔݡዠҠ蹱ҡተ邁Ұᑈވ㡆睰㭜䁀⤋㙀灠曤ڴ纂ݠᗐቼ㙀灠晤ڴ▻砈橠乢ҰҪڀ桠㞀☠癤⪱ᆀᓀ䞨㙀虨卤ቶ䙂䛘䃉ҡ挰䙈㠼晠䙁◆溠暨ԄҲݠԀ浭ҰҪڀተ㽀ڀꖊᗀ㙀湠鎤㙒ҡҬ䛜䡀䜴䫰ҥԀደ㝀晤乢ዠ朼亀嫐蹲┢䯀Ԁݻݠᖀበ⚠◠籾⤠ᇠ虠灀橢Ҡ暐㹄⤠Ԁ楺歠䙂㙡ҡተ邈Ⴀ☡佀橢ԉҰ鉤⫠ተᄭ暡߀㚚│䯀ځ銩噠ᛀ䙄⪑ҭቦ鳗廻ݠᆀ㛲ҩҭ竢㚪㛀ᒀ䞤ԁሠ㝀晠䙁㙁ᖊ蟠䛰㡂╒䯀ԈႠ■潀橢Ҳ╂䯀ԈႠ㟃䙤ԁዱ▬晢邁ݡ㙈ڨ㹀㢸㝀晤㙌ᯀ椨ڈ㜆瞠■橨䙂䛄䃊ڀዠ㡸㝀晤䙄䅁ᒈݤԃ噰䙰ቶ核激Ұ慲剠ᄠ□ᑼ䙃䛁菽钆蚀ڙҠ晢㙰㙀㚺㢘Ң晰Ⴜ䁆桀激ҨԆ蚀ڠ◍ᕙ㤀Ұҭ暠ᖞ䫖ҡᕉ㤀Ҵݠᖀ㳢㙉繨ڀԀހ暼洠䚂Ң╂䯀ԈႠ㠃䙨䑉㱀Ⴄڬበ䜴䫰Ҩ㙃噰Ԝ㳃軲虠■⍠䙄㕄煠ݣ蛲虠⠀晤Ҷ睰ᙘᖀ䙀㙀橬ሡ坐罠ᛆҤ畤䙐ҨԂߐ麹ҥᑰ鞡躨噠ⵄ㙠㨺│䯀ԈႠ☠躀㡀⠈㐙躤ᅑዠ■歠䛀虨卧垅晠㙀湠钦蚀Ⴀ◌桢䙂㙀⻀杤Ҳҡ繨㺀ԀႻݣᖀበ❐◀㶘ᖁᇿ漠◜Ҧ罰⭐Ҥ晢䙐ݰ䙮㪐䡁ҭᒅ߄һݦᖀ媀㟸Ⰰ晦䙂䅁⚨ڤҳ噱ݠᴀᓁ⫵⻀汤Ԕ☣仠⋂䚪▧湠谀Ⴄ▫歴☠条㛂㚀ᖠ䩐Ⴈᖰᖖ䙃㳀ᗈ䛠䩀㡁Ҭ癤嚈Ⴀ㚠癸晤廈ݠᴐዤ䣆晨ڥԂ梈婤㳃ᣏ虠⥀ң䩐⚨⚤㚂ᄡᖠ暤⍤䚀䡁Ұ晪恠Ұߐ睰▨ݡ艨麠ᒠቻݮᖀ婽晣仠⋂囊㩁ҭ暠በ䁎晡窠ᓁ㩵⡀虦隐Ⴀ⭀ᴒᒠ䇁硨ڨ㛆睠ⳇ㙀遰┰ߋ䙁ᖐ⦪㩴ᴀᒭҤ溠䚨ԄႠ☠ᴐዼ䧆晠湠䩂ҹ䙉嚰በ䜁䙱Ҩ霰ႠⰀᘘ歭Ұߊڊᗐ蹨勠⋂廊㙁㚀䡂塠㾀⚀桨⪡ᦀꋀ幠ᖑ灮衧Ҡ㙣ҥ湠橠洂ҩ蹠ڀᒠᄀ暺檠䦠㡁Ҭ晦栨ԕᖃ詠夰ҩᖄ晦占Ԁ暼䟠ޒҹ䙈麢ᄀᆔݮᖠ朠㺚ᖅተ㚊ҥ盜㙸Ҥ♪│ᔀҰ㟀ᑈҨ乨ᖄቢᆀ◗Ⴀᒀ䞤Ԓ晰蛨⢃Ꮐ衠㟁▤Ңұ繨㚀Ԁݻݡᖀበ䟰■㹂⤠Ұᄭ暠桠ቨߘᖀ䙀䛄䃈ڥԁ蠐■晢歭ҰႤށ塠䁏ҡ窨ҫ闡ځ噈㝄◠朤晠煤䙠橰䝂ᒒ■卤㛂▰㻐朰䣈㛁ᆉᖉዠ杨▸溡ڈᖐቨ杤㙠垡ᄚ䄈月㹈ᕡҰ晤䙃宕䄐啎㩐䆙▬晦䙅䯍湠⺤Ҵ軈ݠݢ㙠ހ杺溂ᖐ曡此⣖䙁䯍皢ቦ㡠䆒ᗁተ㙱宀杺衠㡠㡨婠晤㚐㛀曰ᖀᖐ⥙▰晤鞥ዠ■䩠߀◹Ҩ晨邡ҰҺ钂ᛂ▲ᗁተ㙱㛂■䡈衠㝀Ⴄڀዠޕ湡❃崂㙁ҥ粤Ꭻ㛂■䡇骰䡁Ҡ晨㙩㙀湠桥㡀⚠◠㑘Ⴋ㙀灠晤㙒ҡҰ鉤ᖠҰڈڍ䦠㙀剩ڀҰ䗆晨Ңᗢ㙒ᗁተ㙱㙁胳䟠በႠ⬁䂂ᄀҰ߄ងҲұҭ粤ᒐ㫐ڈڢڰ罠ځ䒂ᰀҨ㘆柄ڠ薰㙈⎞ᅞ㙀皪ⵄ㙢ҩ䩌暢ᛂ䙐ڐ捠⍂晰ݨ⋃晠䧂㙈ڨ䉀ጨ婤晦栠Ԁ鶁鹠Ⴁ癠勠ጠተԀ晨䚡塠⚠Ⳅᑔ䡄䅁䁈ڄԖ硬Ҥ驠ԀႰႺ橠婳ꈸ枌婤晢䙐ڊڍᖓ熺ᖡ㡈暀ݰݤҤҲ晳䛈⋃杠䷦暨ڄԑጸ躌晢桀ԕ□产☂Ԋ⠃ꊧᓂ㪃䝈ވ乨▀䑍ᖱᰀᐡ䙠㙟ဘ䁐䡚⚨䙅䝄䡐癰▯曜⭀⢄㻈䞀䙿တ庢Ԋ♂㛅သሁ湡产☨䩤㜜ᯀ䙁㙁ᖀᖀ㩐ᇰ❀㹂⤠ᇠ陠◝滜Ҡ曐Ҷ䙀㙀灠槤䙤♣盠ᘃသᇸ皢㓎䡀㡈䠙ᒁꔃ廰ݰ䥎趇㟰ڰ晠䙁㩁ᯈ暨㟇䝀⚦ሼᓱ䛄䍜橠䩐樒ᯃꊦ鞀ᄀ汽璮䦠߁Ҡ晢乢⠑ݰ䥎桠㡌ᕸ⎂杨悙■溁┄⪧鹭袠ጡ⫻䋜洠ᄢҡҤ癤㙢ᄀ汽ᖀ䩘▐㐅ተ髒㙁㚂㔈㹏陻櫠ᘂ㺶徙⻀ቤҢҩ䙈㺄ጡ⫺■源㘠䇊ᖡ轄䙂䛄䏐噿蚗⚠⚤坌飒䅀ᒈҤҲ晰䛈ᘂ㺴㙁㚠䘀嵴◣砨晤杨憀蚟曎㡀㡈蠹譄屠ᖐҨԅԀ䝐⚤坈䙂䜀无针㛇䧑ҩተ鲡曟ߜ䩀䩑樓瀨鉠ᖠҰڊڀዠቨ蠰晠柠ꙁ芰䝎涂Ңᖡ鋣သᇸ湠◃┇㧑繠ҷ㙄ݢ蘨虨㝆罰⭐ڀԈႠ◠ڈԇ鹲ݠᏃҡ䷢㙈ڨ㙃噰因ᏃҰ䫆暨Ԉ㹈Ԃ䩑ڀᒠހ瘼亐ҷ㠐Ԙ晦䙁䛆䏐扠㵣癠因ᴀᄡᒻ㚏针㹀⦱蹠䃂ᒌᆅ湠詠㩓ꈪᯀᑤ恠┰߈Ԉ㚧塩ꑥᒀᅒ䍀ᔈڤҴ☃罤ꗢ柠ޙ㓀ᇤԒҪᗉ鋢┑䜸ڜ涠߄◀器㲀ԈႤ☠橠Ꮐ㙢㹑چځ㙵满ᘀԄҲݠᘂᅊ㝁㞃䙈㛂Ңᖑ窰በ㝃㚀哤䚒ұҨ晪潻㝁■溁ᙑ罰㭅ꗦ板慰曠湤ڠ䡁Ұ晬屢⪰Ⴐ䙦蚁䝀㛀ڐበ䅁ᖃԁ塠䡈ߘᖨ⤠ተݨބڄ☣亠加ᖨႢ◠橠棠㙂㩑ڀԀႻݠᖀᖐ䦑Ҵ鉤ҬႥ湠源㹈ᖃ蝸䁂䙂䣆晨ڄڄ◣伀ᖀ㚊ҥ橩晡塠䡉ᇨ湠䙀㩁ቨ䚁塠Ⴀ⚤ᑔ屢ᖐҪڀበ㦑Ҥ驠ҬႥ湠詠㩓ꈪᯀᑤ恠⋐߈Ԉ㚧塮ҥ諔Ҭ䛁ᑈ䙤Ҳҡ䙈◠ԈႤ☠珉嚤ႠݠᗀႰ⠐Ҫځተ㚙Ҡ癤Ԁᄕ■躁洂Ҩ析媠Ԁݰݺ洠䛀罠Ⳅ䜔䩀䛀ᑮ蚠㚗齠ހᖰ䝃ᄀݰᖀበᄠ◑⪨暀Ԁ歰䡄Ҥ♃仨ጰበ㝂⍺歠䙂㙐婥በ䝁ᯁᑈҥԀ杰☠ڐቬ㝀珠柤Ҳұ繨㙘Ⴋ㙀湠◂⍂Ԁ鋤▦暀ተ枨ڄ䙔♃仨ᗀᄡ◕■歠䙂㙐鋤◠ᄡ⠠橨ڃ崂晰ݨᖚҫ㙂皠⍠䙀繲ݠ⋊Ⳁᄀ■ᖀᏀ㜢ᖉ軣曯虠䃈暥Ԁዸ㝀晦杰䛊■譠䝂Ң㺭窠ᄖႠ■䟠㜀㚙Ҩ晢屢Ұڃ䙈䐉㱀Ⴇ待晠㩁Ұ嘤Ң晰頽裌በ┥湠䩀姀㜁Ҡ癤㙢Ⴂ㙈Ԅԃ噰曠ᗀᄖႬᑈҨ㞆瞠■橠歭Ұڐ䣍䡀ᇰ■晠䙁䅁ᯂ蟔Ԁ◃ꌠݤԗႨ■ڏ驰ႠᛆҤ潭ҭ㚇詠㩟ꡟꊽ㱚Һ㙀皡橠㩐樓䋈ᙖ鲡ޘ湠満㶆聩ꁈ㲄ᒶႮ■躀䶄㑄敠ߔ䝂ᄀݰڈԄቮ颫Ҡ乢ұႰ䙤ԗ䝐㰄☠䙂㩁Ҩ䚄ԑᅙᖌ晤㚆㙀砣䙤Ԃ▸器㳃苲虠□ᖀ綃噰ݠᗀԖႠᒀ蟄Ҳһ盤▦暀ႰႰ䧮詰䧋佤䜔䡅㩁Ҩ曈眰㝀㝄ᑨ䝄㙁滠桨衠⠸婠㱖䙃㩁ቨ暄ң噰因ᴀԖႤ■ᖀ姀㚡Ҡ晢屢ᖐҰ䙆蚁曘勠⡀ԖႠᑈҤԃ噰蛠ڀԖႤ■ᖀᓠ㚠叔ቸꛁ誨噠ᛀ䙂㙐㝁ᔁ㜀Ұ柠蹤Ԃ㙉䙈㚂ዠݴݡᖠ塠⛠■桨䙁㩁ᒆ橠㡐坠㭄ᑔ䝅㙁ᓀᅁ婸ᘞҡᕾ䕠Ꮠᄰ晃鬱耐■晰⦷Ⴀ桿諀ᖑᓙ▬湠ጠ㙀灠曤䙤亂Ⴄڂቬݥ湠䭀䝂◉Ҥ晤䙂㙀灠杤䚂ұұ㡶䡂寻ݡᖀ㡀⛠■橨䙂孻ݠڈԄҲݠᖈ暀ᇠ桺橠椰ҡҤ癤⫢ᔠ暽ᗁႡ潠Ⰰᖐ䡆䜁䙱Ҩ蜰☀◍በ杠䜴䙰Ңᇠڙҩቤ畤䙐ߋ䙁桰灨ᘄᗀᓁᖵ□ᦀҲڂᖅ誀㽠ᆔݢᗀ詸㩆㙁㑚ᄀᆖ晣ᖁ㩐䧣滤▸ቫ䛀皠亟▬Ҡ曈Ҷ䙅㙁灠柤䚃噰㛀⡀ᰖႠ㚀ᖠ䛲ҩҽቢ邖ႦᑈҤڃ癠ᘀڀዺҠ■躂⍂䙀嘐ቢᓿ㙀■ក塢ҵ孨⎬ꋗᆐ■◅⍂◈⚠晠案ԕ⠀晤䙴仈ႧҠ䙃寱Ⴈډ地Ⴀⳇበ潤䙐߈ލ䡀⚠㚁㹴䙀䛀⻀獤ҢԈ晠晢䙄孰暨ڄچ罨◐ቶ䙃䜠Ұ旰ꊠݠ鉠㲀ጡ虠㨁■婢ҡҤ䙀䙁䛠䄈䙤Ԅ⠃仨ᘂ斫⋀ᑂ詠Ꮐ㦁▬晤邂ተߓ蛨በ䡎ҡ㱈暀ዠ陠◑滬Ҡ曐Ҷ䙃㙂胨ԄԁᎠ軠ڀԈᄔ■玦蚆曘勠ᴀᗁ沤噠ባ癠蘈ᖈ⚞ᅞ㟀㚌⺤䙢䙁ҥቨ邁ተڊڀ檰䡁Ҥ癤ԁᆐݰ䭍䡠偨ߘᖀ䙂䝀琠詤ԂҲᘁ竌ዬ㙁㚋ⵄԑԐ軠ᘂ㺪㙂灠晤䙳噰ݠᗀዩᆐ☡浀坢Ԃᖡ窠ᒶႠ□ᖀ觐㙀勠ᘂ☊㝁湡◁⍂晰ߘᖀ䙁䛆䃐䙆蚀Ⴀ㛤ᖀ䝆㙀盠䴠䚄⫬敠ښҠⳐݨ߆隐ቨ坤◀岂ނ杰◀橰蛢习㲀ᄀႴ朠⎀䙂Ҫᖡ窠ᒨႠ⻀晤ҤⲤ兠ڬቤ㙀■䴀䙂Ҳᙁ窨ҫ譠晠湠䩂Ҩ㝀晤杠䩆暠湠䩀㨹Ҭ癤ᖄ䙐ߐ䝍䣀㙁▥⠈暀ᄂ杰◀㡐☀㙭ᒋ㘀Ҷ晠ᓄԄ▨朸㹄⤠ᆔݠᖀ㩐⚠◠詸Ⴋ㙁㞁▨㙒▨器㳃ᣏ虠⥀ң䡀㡈ᗀ鉶䡁䣆暢詠በ❐▰晠杨孰ݭ暠በቨߘᖀ㕋㙀㚀䴀䚀虰勠ݢԖႢᒀ䞤Ҥ□繨◠ځݻݠሡ塠ቨ䟨晤屢ҰҰ䙦蚀ڞ乤ቤꚣԀ湺誠墠Ҳҩڀᄀݰݺ檠㫰蹢ᖠ晠杤孴ݠᗀ䩐⨡▰晢䙁㙂㢆誠㡀⠈䝴岤ᗁ昙皧锤㙐㡁Ҩ☠䙃㙁⻀楤Ԕ▩繨亠ᒠҴݠ⍠䝀虨勠⋂ԖႪᑈڤҲԁҭዠ遰⚰ߊڀ桰⚠Ⰰᖀ此䙐ҨԆ蚀ႠႤ♴䙄䅁ңځ塠⠌ᯂႠ麦⋀湠企癢ҩҭተ邈Ⴀᖒ晡坢噠勠⋂䚪㡀ᑲ暀㙧齸Ⴄ朶䡃㡀ݰڈበ⚠ᘀᙔ䡁䯆晰䝄Ҥ◃伀ᖀ䡂䛀荨曤Ҳҩұ㡶䡁㙀皢❃墀䡋ꑭዾ鲁ݡ㙈ڀ橢ҹҨ鉤㹠ᇠ暭暢桠㽀ހᖀ屢▦ڂ詠婰ᇰ◰㲀ᒠݰႨڨ㝆盠绠ᴐቤ㛀湠譠䙄亂ݠڀᄖႠ■◀洂ԁ繨Ҹቫ㙀盀噰▧梐婤晢歭Ұڈڨ㛆瞠■䛔ҫ△Ң詠婲ᓑ㙀㸺Ⴁᄟ漠◄⍒㙩㙁ᓹ㘀Ԁ閃鹠Ꮐ㙁▹ቢ邖Ⴀݰڈበ塨ᄀ䁀柨灀ҫ䙀ߐቬ䢏Ҡ条䍀Ұ囲扠ቬ㢏Ҡ乢Ԁ暺洠䙂ԉҨ鉤㩠ᐠ龂繠ᓠ㚡ҵᒉ➀һݢᖀ硠䠐ڠ晪䙃䅁ᖐ寱ꊠᄠ■橤杠䩆晰寱ꊠႠ⚤ᑔ屢Ԁ醃鹠ᖛ䪾Ҡ癤Ҥ旰ᄨҤҲ晰暤በ䙅㙂炠虦隐桭碟Ҡ乢Ұᄰ䝍䩛櫞Ҡ癤ԈႪᗀ䙈䄈ꔀހᖀ条寢湠柆蚀ቬ䢏Ҡ杠䍀Ҩݡ癰繠剠㶘Ⴁޟ曰ڈበ◂ݠᘂڈ⋀替詠壠㙠㝀ᘀ䙃䛄䃊ڀዠ䡨㝀㹂⤠ᆔݠᖀ桠⚠◠詸ቫᣐڈڈ眰ߒᯖ䗀ԍҠ⋈ڄұᇰ勨ᯈ暀Ұߍ暠桠ቨ䟨晤屢ҰҰ䙆蚀ڸ勠ڀᄖႢ■◁⍂ұ繨Ҹቫ㙀㚀⍠䚂Ңᖡ窠ዶႠᒀ䞤Ҥ□繨▶䙀䛀珠晡彰▰㐼ᑼ䥀䛐䄈暤晢Ҫᖑ窢ᒠݴݡ♀橢ҩ䙈ڂᄀᄀ決檠橰ᇰ■晤桡䇁橨ڄԄ☣伸ᖸ䙂䛎䃈Ԃڡ睠⚤㜔䙄㩁Ҩ暆蚀Ⴀ☠ᗒᒐ㝂琠虤Ԕ◣仠Ꭼበ㙁湡䴠䙀罠Ⴆ彵晠䅁ႨҤԓ噰ݠᘂ䚪㡀ᑧ暀በተߜᴐ䙀䛀⻀獤Ҥ㙁艬暠ځ陠䃐晦隐ႠႧ噠邢һ朠ᖀᖝң佨ڮᒀ㙀㚲ҭ䩠ᇸ⪠晠枠封ҭ蛀በቩ蠉ᖀ嵣ҰҰ䱍䩠ᇸ⪠晠栀櫀Ҫ䚠ᓰ㹁ҡተ邡窤噠ក噣幸ݠݢ㚪䜘䡰ҥ㙰ᇸ⪠晠杸宀钂㹀Ꮠ㹁艬ҷᯁݠ蘠湤Ҵ㑈ᇭᕾᅑ䛃㨁▤Ҵ㕈ᇭᕾᅑ䛃㢃䙤Ҵ✣勨⋃ꙁ开棳蛨በႠ♸ᖈ䙀㙀盟蚎㦠㙀抌晠柢曂ҭ暠በႠⲨҨ㕋㙀㚠癸晣噰ݠڀᄡ䇵瓠ݡ霒ҢᯊᆈԖႠ■ᖀ㩝幣午Ҩ⥬ݠ蘨虨㥆罰⭐ڀᒠݻݡᖀ塠ᇰ■晦杴宁ݭ蚠በ䁉堉ቦ屢Ұߐ䚆蚀蝠ⳆႹ晠䅁ቨڨ㙳噱㛀ᴀᓁ㙵⻀桤Ԓҹ繨皠ᒠᇠ杺洠䡂Һᖡ窠ተ㧀ᑛԀ㸲㹂ᙁ粤ᒤҰ߈Ҧ蚀Ⴀ⭀Ꭼቤ㙁皥ⵈ䙣幰ݠ⋂勊䛁珠晤Ԕ▱繨㺀ᓁ皧噠⍠䛂Һᖌ鉤䩠ᆐߐ䩍䦠㛁Ҭ晦杤孻ݪᖀ塠㿰☠晦杨孰ݤᚠޖ虨ᨼ池析寱߉ҤԒҡ繨ڀᒠݻݡᖀ婱䦒▨鑤Ԁᇠ煺満姀㙁ҭቤ屢ᯐߐ幱鉠ᇰ◀晦杣䅁⚨ڤԔ⚣伸ᖠ䙃㙁皡ⵆ蚂杠⭀⇬ዠ㙁皢ⵄԁᄘԍ繢ᅟ㟀㚌⺤䙲䙁Ҭ晠屢Ұ߈Ԇ蚀䝀Ⳅ伴桢䇁Ҩڨ㤆硨Ⲙᖀ䙃䛁⻀柤Ԕ㗤慠ڬቨ㙁皠贠䢂ҹҭጠ邖Ⴈ■詠婰䦑繨皠ᒠᆛݨᖀ婰榱Ҩ䚎ҫ剠暿諀ᖒᓙ▨湠䙀㩁Ҩ䙄Ԅ♣仠Ꮒ㚪㫁ҭ蛀በ㡈栈晢杨孴曠⎀噢ұҤ硤ԗᆄ■橠ᓠ㙡ҩቨ邀ᄀ桺桠衠㡉ᇨ湠⥮ݡ䘈ҥԀႨᘀݣݠ衠⻀晠䩂Ҫᯂᆈڇ⋀㚠㙘晢▩Ҡ癤ᖢႰҰ䝍䣀㙂㹴ڀԀᄀ暺洠䚂ҡҠ癤⫢Ұݫ䙀ዠ⠈搥窺Ҡ䅁ҨҤҴ◃耈聠ԁݥ湠䞬院㹂ᙁ粤ԄԀ螃鹠ᑐҠ㝀晠杴宁ڍ蚠በቨ♸ᖘ䙀䜔䢰Ҧ蚀杠Ⴄ⇬ዤ㙀■䴀䤂ҡҡጠ邖Ⴈ■ᖀᖒ覱繨暠ځᖵ㚴㝸ҡᄘԌ晠析孲Ң輠㙗齠☠ڐበ㝀⠀曤Ң晰䛈⍶煤䙐ҨڤԁށҠ癤◁ᆅ湠ᛀ䙂һ仠ጠተ䱍■ᖀ䡀䆑繨㛂ҫ䳀替躐罜ҡ婠Ԕ䙁㩁Ⴈ䚄Ҳ晰ݤ⋂◡ቨ⻈暈皤ቨ㝄㙠灠ᣐڈچ蚀䝀ᘀ⇬በ㙀㚫㞘ң噰㛀ڀᄖႠᑑ蚀㸲㹂ᘁ粤ᒤҰߐ䟍䩠ᇸ■晦条䅁Ⴈڨ䈈葠ߘᖐ䙃㙀珠槤Ԓҡ繨嚠ᒠᇠ決洠䙂ҹҨ䚎ҫ䇀ݰᖀ㳔▪䍆Ⴁݠ扰ښ詠ᘗ㚨ݠҨ暡椧陠ᦀҡ睠ݠዠ岂ނ榠䞤Ұ麸Ԍ顠ጠᄟ湠源▬䙂䉑ݢᄀҰݨԅԁݨҠ䁂䁋㙁榠亀ސ麹Ҡ晦杠㙀灠柢㙰ڙꊤᑾ䥀䛐䄈晤晢Ңᗑ竤ԗႠ■◀㦠㚡ҡᓉ⩀һݢᖀᖟ䪖Ҡ鉤㙠Ԁ桺溕漜Ҡ曼ҷ恢ݡ䘈虨㡆罰☰ڀዠһݥᖀ䩛誾Ҡ鉤⫠ᄀ閂鹠ᓠ㚁ҩቢ恠⪰ݨԆ蚁ႸႤ䜖䡀㡀ݰᖀ䩐榱▤癤◂Ⴂ㙈ԅԀ蝰Ⳕ䁂䙀㙁⻀杤Ңҩ繨◠Ԁᆛݠᗠᖑᓙ▤湠䙀㩁Ҩ暨㜆瞠■桦ጠᄟ曰ڈበ㞀▰䉄ҡᆅ湠蠀䩐Ⴈ⚦⚳晠ᯀ椨ڡ癲ұ䙈ڄᒨႢ◠橠壠㙀勤ᴀᄀႻݡᖀ㡀㿰■晢栜毀ҨҥԀ䝐ᘠᖘ䙀㩁ቨԅ癡ݠ穠㲀ᄡһݡᖀ㡀㟰■晢栰毀ҨҥԀ䝐ᘠᖘ䙀㩁ቨԅ癡ݠ穠㳃曨虠㚊躟滼Ҡ曬Ҷ栠櫀Ұ䮨㼈籠ڀ池⤭ҡ㙈ڭ㩐⠺ᯂႡڸ㙁脨ԉ㵤亂ݠڀᄀᆐݤᴄ䙀蹨剠㲀ҫ㧀■ᖀᏀ㙢ᖅ袠ᅒ䛁䋍暠桠Ⴀᦈ橠䙀㩁Ⴐ䙮䦠㙠勠ቢꙂ䙐Ҫڀ梀⠨婠晠杨孴ݠ♁癢Ҩ晴㱖䥀㙁■歠䚄⪓欸ᖈ䙀㙀皠咦蚀䝀ݠᑔ䙁䅁Ң訠በႠᛄ⎄屢ተҨԍ䡠Ⴀހᖈ条彻ݡᅂ晢Ңᖑ窰በዠ■ᛀ䙁Ԉ劌塢ᅟ㙀⠀桤䙐䨹Ҥ⡀ځ⠵⠀晡圑㙂ᗤ晠条憕皠ᖀᖑꃘ銌剠䙀㙀皠咦蚀䝀ݠᑔ䙁䅁Ң衠በႠᦉቢ醡Ұښ钁幰器䀼ᚾ䙀㛂曰ڈԄҲҩڀጡᘧ杰ᖀ䡀㻀䫈㑚ᄡҦᆂ躁ᖐ曡櫤ݢ㪁ᖈ⬈䙨㝄◠朤桤杠䛈㚂ቦ㩐㧣勨☣ݠ摰ݨҤҶ禳卥镂杣寱ҨҤڄ缹ҭ䁚ᓁ▰ߐ䛍䩑ቨ䚀裢ᡋ㙁礦躁Ⴃ⚨☠⠠皂ҰҤ♤䚁ᎩᖄᘀጠᄀݰڈԄႠڀꖊᗀ㙁□❁皢Ҫ╒䯀ԈႠ㟃䜄Ҵ㖄煠ڐበ䥆木Ԃᕀ躩Ҥ䛌䡆㙂䃈杤Ԅ滈䫀㚀Ꭻ㛂□源Ԅ滈ᘀዠ⪬Ⴅ湠ቨ衰⚠⚦Ҥ潭ᖐڈڍ婸⪠䝤晤杤孰ړ咁皢ҩҠ癤Ԃޕ㚄ⵄ㚂Ҳᗽ竣ݠቨ⬈䚁曠罠ᛄ㼔乢ұጨԈ㛆瞠■橢浤䙐ڈᄆ蚀蝠䫀Ꭼቨᯀ椰慲剠ቮ被Ҡ乢Ԁ藨߈㙷娛欸ᖀ⥁◀桤ᰄڄ躂ݠڀተ䳐暨ҤԁᄩҤ晨㙩㙀湡በ顠ڨ䩰㑖䙀㙄ᖊ䩀ߐ曀㹭ᕁ㤀Ҵݠᖀ洂㙡ҩ㡚ᛂ䙠橰䝂ᒒԁҩ粤ᄫዠ■ᖀ杢灨ݤᏂԁቦڂ詠በ㛂嫨◠Ⴐ䳐柨ҤԁᄩҰ晢㙰㙃□歠䚄⪓欸ᖈ⥁骩噠ᖀ槀㙂┢䯀Ԁݻݠᖀߐ廀㩭ዠ杨▸湡ᖀ䳲㙊劔ڀԀႨ㦈䛄ҢҰ朄晨䙁▴湡ᖀ㝀庹Ҡ䁊⪣ᦀ龄繠Ꮐ㙁ұ窤ᖠᄅ榠䟀䛲ԙҴ晢䙃㙀湠较坤蜱Ҵ䙊⪢ᣐҨڂᙒ▩Ҡ晤㙩㙀湡ᖀ䳲㙒ᖅ諌ቤ䜲䫰Ҥԃ噰Ⴇ羅晠㙀珠晤Ҡ蹰勠ᰀᄂނ榠ᖀ㡀你ځ⭂麡摰Ҥ▃崂㙁Ҭ晠䙃䫍橳ᖀ睠什◌普⪡ᣐҤ▃䡀ݢ抌㱖Ԁݢ㙈Ңڐ纸扠晠条恱Ұ䙄Ҧ臰劰ڀԈႠ■䩀Ꮐ㙡䙈㹢Ҡᣌ晠癄Ҵ◪扱ڀᄀҨጣԁ塠ݠᖬ㲂Ⴁ旡㙈ҢҲ㙊㩴ڀႰ乨㘃䙄ҲҠ枌婶䙁ᣑҨҨ伮㘵嶻絩唶һ朢ᖀᖬ華嵃徝苺紟琠虡墀ႠႪ倳灐ꈏ詆馏駐㺁ҡភ漡篔ꇎ颙ң幸Ԍ晠䙀䞲帑霒Ⳉ啓鬼ᯐ䙀䞠꒾捹澛㳊ᙜᯀ⤓ҰҰ寱剠ᇰ▰晠䙁䅁Ң蠀በᅈұቤ鞡ޛᑥ䠀㜗鹳ꌠڐበ㛂湠ᛀ䚂◐⚠ᘀ䙁㝃灠晤䛢ҩ䙈㚄ڲዠݰᖀᗐ蹡Ҵ晬邁ᖐሐ䟍䣀㙂ᖅ窢ᖠᏐ晠蹠䩂ҡᖄ晨条寱Ⴑ䟠በ⚠䝘䁄Ꮏ㙀煠Ҥ䙄▢幱ڀځ꜠芨䚄Ҵ▫亐ቶ䙁㳀ڐ乎㡐潠Ⴄ敂䝂㙀㚗退橢Ҳᖙ躠✒㛁■亀䳠虨勠ጺҢ䛟芨ᄈ㚧䧑ᖤ晠某䫂㙈ᄄԄ☃砨桤䙁䛁胣ԁ塠㡈瀱ᒁတԘ湠䯠Ԕ➻櫠㣂⇴徙☠源▬䙂㹴ᴀᄡድᑈ晤Ԓҫ合桦䙂䜀䙱Ҩ霰☀◌㲀ᄀᖣᓀᖀ㤀ҡ□በ璀Ԁ繲咤Ҥ⦢䰉⠈暀ԀꞀ咈㝧䡌ባ虠鞀ݶ晠躇鵲ҩ婠ᘂ旑䛃䍈ԅ癠⠉ꑥቸ髒徙㚠㙘晤囈ᖬᘀጠ㙁瞣䙄ԒԒ扱ݢԁݰ߈߈蜰☀◍በ䝁㙁湡厥晠ቪᄀ䁂⤠Ꮠ暢詠塠坠ᗬ桬䙁㙂湠䦤㚐罠佴䁄䙇㩁Ⴈ䟀䩂Ԓᗁ䑈晢昀晨䚈㙂◂ᖀ桠ጠᄀ□亀崄⪃櫨ᴀᡋ㝄□濁癢ԑԁ粤⛡ዤ榠ᖁ㩐䇉ᖩበ䝁ᄀ■詠竀蹡ԁቦ鞁ቡ㙈ڤڔ⪛琉ቦ潤䙠晨䚡晰罠䝅齂䝋䛀◠蛈በ⚠⭀⣔䡂㱀Ұ幏鬆睠⚤ᑔ剠Ԁ阿辭䡀㡈❈繠ځ蘟磺橠䩐䆑噠ݣ旟䭵◠䩁塠䁈㟨橦浭ҥ椨ݨ眰Ⴀ⭀⣔䝂ᇠ■䩀䤀Ң⎝ꖔ邁ݰݰ䙭䡐㝀㝄ᑖ䡄⋀ᑂ詠硠榱ᖌᘀ䙊䣆晨ڤݴ⪃氈橤剠Ԁ阿辤㙂ڒᖅ⪺ԀҰݫҠ㩛ꊚ倈桠䙊䛁㟃䙄Ңұ噠ᘃ旟䭵◠ᅄݴ△绤㚀Ԁޕ◡ڨበ㽈ݠ㛊Ⳃ䜠ڈႤݤ㑀វ岤ᓁᇸ溢䩀婰㧡ᖬᘀ䙃䜾ڜ䪁䪐䡂ᖀ桤⪡ᣐҨᄨ㙧䦑ᖵበ䝂㙀◠䚨በ⠨婤晤䙁㩁Ҩ栨㸷䁈䐘晼杦憙㚠嚰曧⥑ҥቨ邈Ⴀ☠溏鶔◛绠ᘂ⇶往蛀盡⎶睠ᛄ㜔乢ұݰ噎婰我ҩቬ鳒䜀蜁Ⴎ㳢Ҫᖱ窰በ㝁㚟铈㚷坠⚤Ⲭ颡朡䝂㑭䡐㝀ᛄ䜔䡁㙆砣䙁園ځҭ粢◀Ұᑚ檀塠㡈䠙ᕿሼᔸ湠溟鹿蚛氉ᒃҤ岀橽橠洂◁ԅ⠚ҫᄟ皠ᖀᗐ蹠軠ڀ⡁ᄚ䃈晥ԀႰᛅꗦ杧慰ڐ䜎趄⪬⠐㜢䡁㙄皠伡癡睠ᘀڐቤ㝁皿铈㚷坠ⳄⲬ颡朡䝂㑭䡠⚠䭄ᘌⳀⳐҪځዠቫꑭቮ鲀Ԁ柽璨㹘㩠䠄晢遫㝀㚂㔈䘸⚃櫠ݣ꜡ꔃ芺源㹀䦢ᗁ銠ᗪ㛂ᒀ䞨㙂Ԓ㩴ዴ䙆䛁芨䚤ڤ◂扱ڀᴁ撘溠䚨በ䝀☠⣔䡀㱀Ұ幏鬆睠Ⴄᑔ剠Ԁ阿辭䡀ቨ❈繠ځ蘟磺橠ᖐ䆑噠ݣ旟䭵◡ᖀ㡀㡈㟨橤浭ҥ椨ڨ眰Ⴀ☠⣔䝁ᇠ□ᖀ㤀Ң⎝ꖔ邁ተڐ䙭䡐⚠Ⳅᑖ䡃⋀ᑂ詠朒▨噤㲀ᴅዠ㚀ᖠ㜀◹ҹቦ鞁ቡ㙈߈㚄溂ႤڂᄡҰ曣ԁ塠填頤桦杠㛀皠ᖠ䙴Ⴀᘀᗀᡊ㝀⤀Ҩ䈷ꃳ仠ݢᅊ㱀Ұ幏鬆睠Ⴄᙔ剠Ԁ阿辭䡀ቨ㇈繠ځ蘟磺檀㡀㽀⚤♴䡂䧆晢蟄ڄ仈ݠᗀᡊ㛀ߐᖀ㡀ᅀҡᓾꛊ孰暨Ҩ㙖睨ݠ☢ᅋ㝂ᓀᅁ塠⚠垜䁂杠㛀▣ᖀ㳲㙉ᖌᘀጠᄀ□谀ቤ▫劘ᖀႢᦀ晨䚤Ҳ■噤㲀ᄡޛ◠ᖀ㩐⥒ᖅ銢ᒋ㙀㚀厤㙒Ԛᗡ窰በ㛀□躂洂晰ݤᗀ⏈Ⴈ◡蚨ԔႠᛄᑖ䡁䣆暨ڄڲҡ䙈䙢Ҡ䣆晢躀㜀䚚ᖄ桢ጠ㙃盀㙘晤囈ݠᗀកᒐҪځ杰㹀婡በ䝁ᄟ朰ᖀ塠⚠Ⳙ䁂䁠ހ暺檀㡀㝀䋀ڐተ☠ұ䟠ޒҪᖅ籶䙃䫐暢詠㜀㺘噤㲀⏈Ⴊ□䩀衠恨蠈癤ԈႦᗀ虡晰罠䋠ᖨ䙅㙃□躃⍂晰ހᖘ㝃ҥ椢晨㙂ң勠ဂ⤋Ұҫ䙀橰䇊㩬㹀䙀㙀皠钦蚀䚘婠晠乢ҰҪڀ洀绐ݠڐበⳁ癣ҡ噠蓸㹈㴾Ꮎ㙀ⵀ晤㜒㹂ᙁ粤ងԀ瀨䚀䩂ڪ⡃䉀穤䙐ᓈ䠁晰繺ݠ⢂✊㙁䃈晨㚆罠嫠䃅㜎ڀ☣溲Ⲡᕳ鳼橦桟꜡芰拠⎂㙲ᖅ軣䫌虠䃋虠ᔰҡҡቤ醀ᆐᆐ拠⍦聯ꡜ⎂条悀较㹀⍂鹠ဌҠ䙂䛂䄈䚄ߔ㸾␜蔌䙎㛆榠ᅁ塠鮙▭ᕆڋዠ■満䳲㙑ҵቲ郊㙇倨晤Ҥ㘿ꊭ裣詠嵱ߐ拠⍦聯ꡜ⎂条悀较㹀⍂鹠ဌҠ⤂䙐ߐ䞉隤Ⴀ⚤ᙖ䡂㙂皢厭䡀䁈᧱ᓉⲀԕ⩀ҧ噠ڠᖬ晤条寱ݨވ㛖禱ҭᎠ邚Ҡᑀ癄ڔ◫仠ᙔ䝈䛕盀㙘晢ҩ䙈庤ځޘ滠规㚢Һᘜ晤醂ᘵ◠溗漜Ңᖀ晠杤廭溡蚨ԄႠᘠᖀ此䙠暨䙄Ҵ♃伀ᖀ䡂㙀皦ⵅԀႰ⭀⬀⎰㣆暣ځ塠㝀ᘠᖈ䡃䷢㙐䙤㙂Ҫᗑ窰በ㝁■亃⍂晰ݨᴀᰀᔈ⛣䙡暀罠Ⴄ㜢ᗀ㙀灠桤㛲Ҫᙀ鉤㙠ݶ晨ᖡ橰⚨ݠᏂᄚҰ■亂洂晰ݨ◠ᄡ⫵⠀晤䛢ԑҼ䚊ⳁ㙁湠珈㙖睨ҩҦ暀Ԁ暺誠ᗐ蹩ұᎠ䙊㩁ᖄ䙀ᗐ蹠卤ቸᖋ䛀溠ᖀ桠杠䫀㪐ቬ☡晣䙤Ҳڡ蹠暠ᄀᣛݤ◀ተڠᖬ晦䙂寱ݨ䚠䩀㡀⚠晢占㙑Ұ䙭址㹀ᖀᖖ杠㛁湠檀߀◹ҩቢ鲁Ұݰ䙭䩐⨱ᖌ㲀ځޕ◠ᖀ㩑榱䙈ڂዠހ歺歠䙂◁Ҥ癤㙡ݡ㙀蹤Ҥ▫勨ݪⳁ㙂■䩀䣀㛀橠ݪⳀᦀ暣ڡ婰⚨ݠᏃݠ衠㟃䙄ڂұҸ普㙥⋀□ᖁበ潠♀ᖘ㝃Ҧ晰䙄㙀䁂ᖀ晠䙃䥆朦橠ᖐ⥑ᖀ晨䙁㙁⠀桢㙀የ婠㲀ځޕ湠辁暀罠Ԑቶ䙂㙄▢䩀壠㚠橬Ҷ䙅䛘䃉ҡ圐Ⴀݬߔ䩀㟀ᑇҤҲ晰睧魥晠䛈■亃⍂晰ހᖘ㝃ҥ棠ᖀᏀ㙢ᨡ衶⠀㙀⠀曨㙗◸习晠乢ᰀ暼䞡䙂ҡ䙈㻂ᅖᣌ晨ҤҴⵄ敠ڐበ㝀㚁ᖀᇱ▨Ҡ㵾Ⴁᇿ曰ᖀ㡠㡈掔☠䙀㛀楠䞤Ҥ□ҡ糢ᓱ㝂䃈䚤ڀ䡁Ҡ桢ᓀ㙀皠␀ҢҪᖅ窤ᄀᇤ榠ᅁ塠㽀☠♶䡂䛾䊈曭䡐⚠㝄ݴᗀᇠ■躀ᓠ㙁ҭቨ邂ᆐڒ䟠ސ罠⚤⎂䝂ᣐݡ▤Ҳҳ令ᖆ暀ހ普晠በ⠈ᦈ橢䙂䫆晢蟄Ҡ萠▤㔾ጠ㙁☡◁鬰䡁Ҡ桤⪡ᣐҰ䙄Ҧ聨㐄橦邁Ꮠ߁▤Ң▱Ҥ桬ᓀ㙁□氀ң癠ݠ⭂ᅊ㛃■満㳢㙑ҵ㡚ҫᣐᄨݤԖ罰䝅齂䡇孰曠湤Ҳһ仨⋂ᓱዠ□躀ᙀ蹩ҭቦ骂ዠ汼䩡㡀䁋頤橬杤孰暰䙄چ聨蠤桨䙆㩁Ҩ䜀婢ԉҸ晲鲀ݴݠᗀ衠䧣漸ᖀ䙁䛂䃈䙤ڔ◃仨⡀ጩ⋀ᑃԁ塠恨ᄐ䁀䙃㛀朰ᖀ硠⛠■鉤Ԁހ杺檀㡀偨㟨橪䙂䫆晢蟄ݤ▻櫤◠ᒠᔵ◠䞤ڀ䡁Ҩ晨邁ᆁ癨ڄҲ蹠ဈҠ䙁䛀胨䙤Ԅ▫仨ᗀᓉ⋀ᑂ詠ސ幡Ҡ晢遫ᔀ■ᖀ㳰纘ݠݢ☊ᣃ晨Ҩ㛆纸⪠ቶ⦩┡Ұ噰⪠ڟ㩄蛂墓䁚班赧㱖㥛㟕犾軏崒爼⺧㥓ᅙ忭楄跏㷹㾙鎎嶧㨉搭謦嗉嶒㾞᧬嶆⨣㰌茲閍䅳⬍鋦䥦㥓ᙄ郀嚑奷聹啥祢頁弬蕆飃㷶䂘氮䵰ҠڀԀڕҠԑ虠Ң习Ҡ䙀㙀僠Ҡ㼠ҠቨҠڞ飕怚㼋鋦粓㥩诬賈壂㿚瑭䳦貦➉毰鋂评䁘猬錦賃俣㿌蜦妏岔综犎䷲ꆻ搩炾駒執茻ⴌ岲ꇫ矵誼飓Ҡ䡀በᚠҠᒴ⠀ҵԀꋀ幠ޙ☋᧱輪鏐恰䍛詬泷妫㟔朤龀排苻鎍赧刁Ⴕ譄闒怙㼋鏭㱢駳牠ԈႰҥҠҡ陠Ҡ牠Ҡ毒得苨Ⰿᴖ䇫砅茮䚳堙䒜㓀Ҡ■ҠҠҠݠҠڀҠހᗀҴҠү晠ҧ䙀Ң䯹錢鋉塰䉒吮豶覫㛁諲铖圖䂙➮綧ᔫ瞑焼Ҡ堔䎛珄⏖爳㫁腊駔㙱㾈㐍鵂鈳㰉葡⪡■⍠Ҡᑶ槛寴蕀醙㻘⩋狌㵦懙搩焮迓悙䒋铎䱲ꇫ忱煐哃徐荹哅賶ꀉ翸裎誒㽱㻘䱦祣ᆋ㻽账飙庚⥌᧦䤣ᅛ琩沾飏崔葫璮噠ᣀᗀޔҠԅҠҢ䙀ҥ晤䙀聠Ҡ㫀ҠሠҠᆅ赆诒悔舻橬豶燃㯐骠諓恷䅙吥Ꮢሱ髡资覎岒自ច鳦ꈋ㫽蜶徑㹗燸銎䲶ꀛ濵甲駔徜爼钬奖燓㟕隼角圚㾜谭㴲逓㼄锨墒垑㺌䳦ᒃ⤱揩饈讍悗舻㒥祢韹弤蕆飃㷶䂘氮䵵䙐晡幠ҠᘀҠހҠᣀᗀޔҠԔҠҢ晠ҥ晤䙀聠Ҡ䈀ҠႰҠᑀዠښҠҸ晠Ң鹠ҡ洰鯎寰䌚喬硦鈋琰朤讀嶗臫喬綆鹧晨䙀䅀Ҡ⩚㐭粲ꈣ卄裀喎堐苹鑅鶆军䰍轄龏怙㼋鎍貦刡忭謢髅忷䂛谆賃❛㜈謤裁㻚牬ᰌ襗䅛灅蝈厐㵙⦬ᨮ嶆㾻堅檼飓⠁橠⤀ҠᒠҠԒҠҷ聻鐌祗ᓙ謤蚾哃圙䀛豎䲖憫琱譒嗓徑爺听沷染㐉楈诓㵴舫䴌襳憁漩欤螑䃘⪬匥鲆觛㇌脤鯆妒苫䱅角韹搭謦嗌嬑⦼瓀ҧ虸晡扠Ҡ棠ҠᄀҠᕠ⬀ޜҠچҠҢ陠ң陬䙀葠Ҡ⠀ҠߐҠሰᰀڞҠҭ晠Ҡ湠ҠҠҠ婓ጺ眕賛臷琘黕鮯礟竣炑泠匽嗆ᰞ䀍隍缸叭沶䝃ᄝ蝈迏嵽㓝吮鶆⦡䛥暠闎㙰湸➍鵆兡ሙ椸鯅Ң晠Ҡ晠Ҡ㙀ҠᯀҠሀҠݠҠᇵ焺闒拰㺛⻍鲖⨣䯽芠闆㙐㻞哬綒ᒳᦅ缪詠ڂႤҢ癠Ҥ詰䙀ⳀҠ䅚劮䱗㨉搭輨嗓徑爸叭浖㾳瀮陨㙀⪠Ҡ⢠㙀ڈҠߘ迂徐苾䰮嶦䞻琩沾雁嶔缺鎍賒駳痠◀ҼҠҳ蚠ҡ鹠ң晨㙀㑀Ҡ⠀䙀တҠҲҠҦҠҠ晠Ҡ习ҠᛀҠበҠڀҠԌҠҥҠҢҠҠ䙀Ҡ㹀Ҡ⋀ҠሀҠݠҠҨҠҧ晠ҢҠҠ橠ҠҠҠڀҠᄀҠᇱ礤飁徜爸叭浖㾻琩沾飁戏菹勅趇䅛᧡椦返拰䈝猎䲦觛艠ҡ㙅■ᗀҠ␀仠ڰҠҬႠҡ䙀ҡ噠ҠҠҠݠҠᑠҠᓋ忱煐䚯愚▻錤ᰆꉋ忱賔䚴媒湻Ⰽ衦燹ݡ歊骀悔㾈ⴍ貦刡ᇥ負Ҡ豢橠ᖀҠ─㪀ԄҠҽ■ҷ暱ҠҠҠ㙆■ݠҠᒃᆁ欠諀妐䁘ⵌ⍦ᓳሁ杄裀垑㻙⬌貆楳俩缤铂庑䋙⪬沆䥣㟙漰諊墖㽛狮ᴇ㥳ᆙ欬諆妓䁙玬账姓䀁獄軀媑䁙Ⳍ賦榣倁缰铈应䋚牭䱦禃俹笰郊宖䃛玮⍇㦣ᇱ欸諌妖䁛ⵍ洦觓堡罄铀嶑䇙㐌赆槓候缼铎店䋜⪮ᰇᒣ柹蜰雊庖䉛瑮⎧㧓ሉ歄諒妙䁜玮䴇㦳瀡譅謢铇声䌝⫮䶂ᓋ忱煐䙠帚荨㐬衧㥋忽炠賏彰䌛ⴌ岲ᓻ㻁缪铇悔◛߂ҡ㙀ңꊬ㙀㝀Ҡ㒌㴦憉ᆕ茨䚩嶒㾞ᖆڱҠ晠ҡꔆ■☠Ҡ⏖覫⻔朲铄夜▼铬㵧䧙ᆅ躠䚢愚▹听涒ᒋ盠ހ⎰ҫҠҬ蛑Ҡ婡鱲雒帒䎘錎䵰㚃埥茮鯁娒暡⡎綗䙀堡謾觅怙羹ᦌ䷰㹫瀵赈襽㻗㐌氦㡂榁篬謪心㿚▬汦䥲迡謔裆佦成腼甎囃ᅑ漠苄⬷圙膫劭㴦䥻㯸䪠咒㵜㒈ᛌ㦆⤱笡櫐嚉Ҷᕝ⫮䲶刂ꐹ焢髕徒茠毁鴷刃ᣉ缪叇岗绸叮夐槻䯝芺诘惟";
const wasmBinary = decode(base32768WASM);

scryptPromise = WebAssembly.instantiate(wasmBinary, {}).then(instantiatedModule => {

  let wasm;
  function __wbg_set_wasm(val) {
      wasm = val;
  }
  
  
  let WASM_VECTOR_LEN = 0;
  
  let cachedUint8Memory0 = null;
  
  function getUint8Memory0() {
      if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
          cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8Memory0;
  }
  
  const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;
  
  let cachedTextEncoder = new lTextEncoder('utf-8');
  
  const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
      ? function (arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
  }
      : function (arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
          read: arg.length,
          written: buf.length
      };
  });
  
  function passStringToWasm0(arg, malloc, realloc) {
  
      if (realloc === undefined) {
          const buf = cachedTextEncoder.encode(arg);
          const ptr = malloc(buf.length, 1) >>> 0;
          getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr;
      }
  
      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;
  
      const mem = getUint8Memory0();
  
      let offset = 0;
  
      for (; offset < len; offset++) {
          const code = arg.charCodeAt(offset);
          if (code > 0x7F) break;
          mem[ptr + offset] = code;
      }
  
      if (offset !== len) {
          if (offset !== 0) {
              arg = arg.slice(offset);
          }
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
          const ret = encodeString(arg, view);
  
          offset += ret.written;
      }
  
      WASM_VECTOR_LEN = offset;
      return ptr;
  }
  
  let cachedInt32Memory0 = null;
  
  function getInt32Memory0() {
      if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
          cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
      }
      return cachedInt32Memory0;
  }
  
  const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;
  
  let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });
  
  cachedTextDecoder.decode();
  
  function getStringFromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  /**
  * @param {string} password
  * @param {string} salt
  * @param {number} n
  * @param {number} r
  * @param {number} p
  * @param {number} dklen
  * @returns {string}
  */
  scrypt = function(password, salt, n, r, p, dklen) {
      let deferred3_0;
      let deferred3_1;
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ptr1 = passStringToWasm0(salt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          wasm.scrypt(retptr, ptr0, len0, ptr1, len1, n, r, p, dklen);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          deferred3_0 = r0;
          deferred3_1 = r1;
          return getStringFromWasm0(r0, r1);
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
          wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
      }
  }
  
  
__wbg_set_wasm(instantiatedModule.instance.exports);
});