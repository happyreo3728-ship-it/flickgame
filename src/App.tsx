
import React, { useState, useEffect } from 'react';

// テーマ：食品100種類データ
const FOOD_ITEMS = [
  { kanji: 'チーズカレー', kana: 'ちーずかれー', category: 'カレー' },
  { kanji: '牛丼', kana: 'ぎゅうどん', category: '和食' },
  { kanji: 'カルボナーラ', kana: 'かるぼなーら', category: 'パスタ' },
  { kanji: 'トマトシチュー', kana: 'とまとしちゅー', category: '洋食' },
  { kanji: '生姜焼き肉定食', kana: 'しょうがやきにていしょく', category: '定食' },
  { kanji: 'ラーメン', kana: 'らーめん', category: '麺類' },
  { kanji: '寿司', kana: 'すし', category: '和食' },
  { kanji: '天ぷら', kana: 'てんぷら', category: '和食' },
  { kanji: 'オムライス', kana: 'おむらいす', category: '洋食' },
  { kanji: 'ハンバーグ', kana: 'はんばーぐ', category: '洋食' },
  { kanji: 'とんかつ', kana: 'とんかつ', category: '揚げ物' },
  { kanji: '焼き鳥', kana: 'やきとり', category: '和食' },
  { kanji: 'たこ焼き', kana: 'たこやき', category: '粉もの' },
  { kanji: 'お好み焼き', kana: 'おこのみやき', category: '粉もの' },
  { kanji: 'うどん', kana: 'うどん', category: '麺類' },
  { kanji: 'そば', kana: 'そば', category: '麺類' },
  { kanji: '親子丼', kana: 'おやこどん', category: '丼もの' },
  { kanji: 'カツ丼', kana: 'かつどん', category: '丼もの' },
  { kanji: '麻婆豆腐', kana: 'まーぼーどうふ', category: '中華' },
  { kanji: '餃子', kana: 'ぎょうざ', category: '中華' },
  { kanji: '炒飯', kana: 'ちゃーはん', category: '中華' },
  { kanji: '海鮮丼', kana: 'かいせんどん', category: '丼もの' },
  { kanji: 'ビビンバ', kana: 'びびんば', category: '韓国料理' },
  { kanji: '冷麺', kana: 'れいめん', category: '麺類' },
  { kanji: 'ドリア', kana: 'どりあ', category: '洋食' },
  { kanji: 'グラタン', kana: 'ぐらたん', category: '洋食' },
  { kanji: 'ナポリタン', kana: 'なぽりたん', category: 'パスタ' },
  { kanji: 'ミートソース', kana: 'みーとそーす', category: 'パスタ' },
  { kanji: 'ペペロンチーノ', kana: 'ぺぺろんちーの', category: 'パスタ' },
  { kanji: 'たらこパスタ', kana: 'たらこぱすた', category: 'パスタ' },
  { kanji: 'しゃぶしゃぶ', kana: 'しゃぶしゃぶ', category: '鍋' },
  { kanji: 'すき焼き', kana: 'すきやき', category: '鍋' },
  { kanji: 'キムチ鍋', kana: 'きむちなべ', category: '鍋' },
  { kanji: 'もつ鍋', kana: 'もつなべ', category: '鍋' },
  { kanji: 'ちゃんこ鍋', kana: 'ちゃんこなべ', category: '鍋' },
  { kanji: 'ステーキ', kana: 'すてーき', category: '肉料理' },
  { kanji: 'ローストビーフ', kana: 'ろーすとびーふ', category: '肉料理' },
  { kanji: 'から揚げ', kana: 'からあげ', category: '揚げ物' },
  { kanji: 'フライドチキン', kana: 'ふらいどちきん', category: '揚げ物' },
  { kanji: 'チキン南蛮', kana: 'ちきんなんばん', category: '定食' },
  { kanji: '回鍋肉', kana: 'ほいこうろう', category: '中華' },
  { kanji: '青椒肉絲', kana: 'せいじゃーろーす', category: '中華' },
  { kanji: '酢豚', kana: 'すぶた', category: '中華' },
  { kanji: 'エビチリ', kana: 'えびちり', category: '中華' },
  { kanji: '小籠包', kana: 'しょうろんぽう', category: '中華' },
  { kanji: '春巻き', kana: 'はるまき', category: '中華' },
  { kanji: '天津飯', kana: 'てんしんはん', category: '中華' },
  { kanji: '担々麺', kana: 'たんたんめん', category: '麺類' },
  { kanji: '油淋鶏', kana: 'ゆーりんちー', category: '中華' },
  { kanji: 'ピザ', kana: 'ぴざ', category: '洋食' },
  { kanji: 'ハンバーガー', kana: 'はんばーがー', category: 'ファストフード' },
  { kanji: 'サンドイッチ', kana: 'さんどいっち', category: '軽食' },
  { kanji: 'ホットドッグ', kana: 'ほっとどっぐ', category: '軽食' },
  { kanji: 'パンケーキ', kana: 'ぱんけーき', category: 'スイーツ' },
  { kanji: 'フレンチトースト', kana: 'ふれんちとーすと', category: 'スイーツ' },
  { kanji: 'パフェ', kana: 'ぱふぇ', category: 'スイーツ' },
  { kanji: 'プリン', kana: 'ぷりん', category: 'スイーツ' },
  { kanji: 'ショートケーキ', kana: 'しょーとけーき', category: 'スイーツ' },
  { kanji: 'シュークリーム', kana: 'しゅーくりーむ', category: 'スイーツ' },
  { kanji: 'タルト', kana: 'たると', category: 'スイーツ' },
  { kanji: 'モンブラン', kana: 'もんぶらん', category: 'スイーツ' },
  { kanji: 'ティラミス', kana: 'てぃらみす', category: 'スイーツ' },
  { kanji: 'アイスクリーム', kana: 'あいすくりーむ', category: 'スイーツ' },
  { kanji: 'クレープ', kana: 'くれーぷ', category: 'スイーツ' },
  { kanji: 'ドーナツ', kana: 'どーなつ', category: 'スイーツ' },
  { kanji: 'ポテトサラダ', kana: 'ぽてとさらだ', category: 'サラダ' },
  { kanji: 'シーザーサラダ', kana: 'しーざーさらだ', category: 'サラダ' },
  { kanji: 'ミネストローネ', kana: 'みねすとろーね', category: 'スープ' },
  { kanji: 'コーンスープ', kana: 'こーんすーぷ', category: 'スープ' },
  { kanji: 'オニオングラタンスープ', kana: 'おにおんぐらたんすーぷ', category: 'スープ' },
  { kanji: 'ポトフ', kana: 'ぽとふ', category: '洋食' },
  { kanji: 'ビーフシチュー', kana: 'びーふしちゅー', category: '洋食' },
  { kanji: 'ポークチャップ', kana: 'ぽーくちゃっぷ', category: '洋食' },
  { kanji: 'グラタンコロッケ', kana: 'ぐらたんころっけ', category: '揚げ物' },
  { kanji: 'アジフライ', kana: 'あじふらい', category: '揚げ物' },
  { kanji: 'エビフライ', kana: 'えびふらい', category: '揚げ物' },
  { kanji: 'コロッケ', kana: 'ころっけ', category: '揚げ物' },
  { kanji: 'メンチカツ', kana: 'めんちかつ', category: '揚げ物' },
  { kanji: '焼きそば', kana: 'やきそば', category: '麺類' },
  { kanji: '焼きうどん', kana: 'やきうどん', category: '麺類' },
  { kanji: 'ナシゴレン', kana: 'なしごれん', category: 'エスニック' },
  { kanji: 'ガパオライス', kana: 'がぱおいらす', category: 'エスニック' },
  { kanji: 'フォー', kana: 'ふぉー', category: 'エスニック' },
  { kanji: 'グリーンカレー', kana: 'ぐりーんかれー', category: 'エスニック' },
  { kanji: 'タコス', kana: 'たこす', category: 'メキシカン' },
  { kanji: 'ケバブ', kana: 'けばぶ', category: 'トルコ料理' },
  { kanji: 'パエリア', kana: 'ぱえりあ', category: 'スペイン料理' },
  { kanji: 'アヒージョ', kana: 'あひーじょ', category: 'スペイン料理' },
  { kanji: 'キッシュ', kana: 'きっしゅ', category: 'フランス料理' },
  { kanji: 'ラザニア', kana: 'らざにあ', category: 'イタリアン' },
  { kanji: 'ジェノベーゼ', kana: 'じぇのべーぜ', category: 'パスタ' },
  { kanji: 'カルパッチョ', kana: 'かるぱっちょ', category: 'イタリアン' },
  { kanji: 'カプレーゼ', kana: 'かぷれーぜ', category: 'イタリアン' },
  { kanji: '茶碗蒸し', kana: 'ちゃわんむし', category: '和食' },
  { kanji: 'おでん', kana: 'おでん', category: '和食' },
  { kanji: '豚汁', kana: 'とんじる', category: '汁物' },
  { kanji: '味噌汁', kana: 'みそしる', category: '汁物' },
  { kanji: '納豆ご飯', kana: 'なっとうごはん', category: '和食' },
  { kanji: '卵かけご飯', kana: 'たまごかけごはん', category: '和食' },
  { kanji: '焼き魚定食', kana: 'やきざかなていしょく', category: '定食' }
];

// テンキー配置
const KEYPAD_LAYOUT = [
  { main: 'あ', sub: 'い·う·え·お' },
  { main: 'か', sub: 'き·く·け·こ' },
  { main: 'さ', sub: 'し·す·せ·そ' },
  { main: 'た', sub: 'ち·つ·て·と' },
  { main: 'な', sub: 'に·ぬ·ね·の' },
  { main: 'は', sub: 'ひ·ふ·へ·ほ' },
  { main: 'ま', sub: 'み·む·め·も' },
  { main: 'や', sub: '（·ゆ·）·よ' },
  { main: 'ら', sub: 'り·る·れ·ろ' },
  { main: 'わ', sub: 'を·ん·ー·〜' },
];

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentItem, setCurrentItem] = useState(FOOD_ITEMS[0]);
  const [inputText, setInputText] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = 'ja-JP';
    uttr.rate = 1.2;
    window.speechSynthesis.speak(uttr);
  };

  const nextRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * FOOD_ITEMS.length);
    setCurrentItem(FOOD_ITEMS[randomIndex]);
    setInputText('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCompletedCount(0);
    setGameState('playing');
    nextRandomItem();
    speakText('ゲームスタート！');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameover');
      speakText('タイムアップ！お疲れ様でした！');
      if (score > bestScore) {
        setBestScore(score);
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, bestScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (inputText === currentItem.kana) {
      setScore((prev) => prev + 10);
      setCompletedCount((prev) => prev + 1);
      speakText('正解！');
      nextRandomItem();
    }
  }, [inputText, currentItem, gameState]);

  const handleKeyInput = (char: string) => {
    setInputText((prev) => prev + char);
  };

  const handleConvert = () => {
    if (inputText.length === 0) return;
    const lastChar = inputText.slice(-1);
    const rest = inputText.slice(0, -1);

    const dakuonMap: Record<string, string> = {
      'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
      'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
      'た': 'だ', 'ち': 'ぢ', 'つ': 'っ', 'て': 'で', 'と': 'ど',
      'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
      'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
      'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
      'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
      'ば': 'ぱ', 'び': 'ぴ', 'ぶ': 'ぷ', 'べ': 'ぺ', 'ぼ': 'ほ',
      'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
      'っ': 'つ', 'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ',
      'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'
    };

    const converted = dakuonMap[lastChar] || lastChar;
    setInputText(rest + converted);
  };

  const handleDelete = () => {
    setInputText((prev) => prev.slice(0, -1));
  };

  return (
    /* 外枠：画面全体の青い水玉背景（ポルカドット） */
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#3b82f6',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.4) 18%, transparent 19%),
          radial-gradient(rgba(255, 255, 255, 0.4) 18%, transparent 19%)
        `,
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
        padding: '10px'
      }}
    >
      {/* スマホ画面風カードコンテナ */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          minHeight: '750px',
          backgroundColor: '#f8fafc',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          padding: '16px'
        }}
      >
        {/* ヘッダー */}
        <header
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#3b82f6', color: '#fff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📱</div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>フリックめし</h1>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>60秒 Food Flick Game</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '1rem' }}>
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              🏆 BEST: {bestScore}
            </div>
          </div>
        </header>

        {/* スタート画面 */}
        {gameState === 'start' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🍱</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>グルメフリック挑戦！</h2>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                食べ物のひらがなをテンキーフリックで入力しよう！<br />
                1品完成ごとに <strong style={{ color: '#3b82f6' }}>10点加点</strong>！
              </p>
              <button
                onClick={startGame}
                style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}
              >
                ▶ ゲームスタート！
              </button>
            </div>
          </div>
        )}

        {/* プレイ画面 */}
        {gameState === 'playing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>⏱️ TIME</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: timeLeft <= 10 ? '#ef4444' : '#1e293b' }}>
                  {timeLeft} <span style={{ fontSize: '0.9rem' }}>秒</span>
                </span>
              </div>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>🏅 SCORE</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {score} <span style={{ fontSize: '0.9rem' }}>pt</span>
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: 'auto' }}>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {currentItem.category}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '12px 0 4px' }}>
                {currentItem.kanji}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#64748b', letterSpacing: '1px' }}>
                {currentItem.kana}
              </div>

              <div style={{ backgroundColor: '#f1f5f9', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '10px', marginTop: '16px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a', letterSpacing: '2px' }}>
                {inputText || <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ここに入力されます...</span>}
              </div>
            </div>

            {/* フリックキーボード */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#e2e8f0', padding: '12px', borderRadius: '16px', marginTop: '16px' }}>
              {KEYPAD_LAYOUT.map((item) => (
                <button
                  key={item.main}
                  onClick={() => handleKeyInput(item.main)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 0',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <span>{item.main}</span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '2px' }}>{item.sub}</span>
                </button>
              ))}
              <button onClick={handleConvert} style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '8px', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                小゛゜
              </button>
              <button onClick={() => handleKeyInput('ー')} style={{ backgroundColor: '#ffffff', color: '#1e293b', border: 'none', borderRadius: '8px', padding: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
                ー
              </button>
              <button onClick={handleDelete} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                消去
              </button>
            </div>
          </div>
        )}

        {/* ゲームオーバー画面 */}
        {gameState === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>タイムアップ！</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>60秒間お疲れ様でした！</p>

              <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>完食数</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>{completedCount} 品</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>獲得スコア</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{score} pt</div>
              </div>

              <button
                onClick={startGame}
                style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}
              >
                🔄 もう一度あそぶ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

