export interface TutorialTranslations {
  en: {
    title: string
    description: string
    steps: {
      title: string
      content: string
      quizQuestion?: {
        question: string
        options: string[]
        correctAnswer: number
        explanation: string
      }
    }[]
  }
  fr: {
    title: string
    description: string
    steps: {
      title: string
      content: string
      quizQuestion?: {
        question: string
        options: string[]
        correctAnswer: number
        explanation: string
      }
    }[]
  }
  sw: {
    title: string
    description: string
    steps: {
      title: string
      content: string
      quizQuestion?: {
        question: string
        options: string[]
        correctAnswer: number
        explanation: string
      }
    }[]
  }
}

export const TUTORIAL_TRANSLATIONS: Record<string, TutorialTranslations> = {
  'what-is-base': {
    en: {
      title: 'What is Base?',
      description: 'Learn the basics of Base blockchain and why it matters for Africa',
      steps: [
        {
          title: 'Base is a Layer 2 Blockchain',
          content: 'Base is a Layer 2 blockchain built on Ethereum by Coinbase. Think of it as a faster, cheaper version of Ethereum that\'s perfect for everyday transactions.'
        },
        {
          title: 'Why Base Matters for Africa',
          content: 'Base makes sending money across borders incredibly cheap. While traditional banks charge $10-15 to send $100, Base charges less than $0.01. For Africans sending money home, this is life-changing.'
        },
        {
          title: 'Super Fast & Cheap',
          content: 'Base transactions are confirmed in just 2 seconds and cost fractions of a cent. No more waiting days for money transfers or paying high fees.'
        },
        {
          title: 'Quick Quiz',
          content: 'Test your knowledge',
          quizQuestion: {
            question: 'How much does it cost to send $100 on Base?',
            options: ['$15', '$5', '$0.01', '$1'],
            correctAnswer: 2,
            explanation: 'Base charges less than $0.01 for most transactions, making it 1000x cheaper than traditional banks!'
          }
        }
      ]
    },
    fr: {
      title: 'Qu\'est-ce que Base?',
      description: 'Découvrez les bases de la blockchain Base et pourquoi elle est importante pour l\'Afrique',
      steps: [
        {
          title: 'Base est une Blockchain de Couche 2',
          content: 'Base est une blockchain de couche 2 construite sur Ethereum par Coinbase. Considérez-la comme une version plus rapide et moins chère d\'Ethereum, parfaite pour les transactions quotidiennes.'
        },
        {
          title: 'Pourquoi Base est Important pour l\'Afrique',
          content: 'Base rend l\'envoi d\'argent transfrontalier incroyablement bon marché. Alors que les banques traditionnelles facturent 10-15$ pour envoyer 100$, Base facture moins de 0,01$. Pour les Africains qui envoient de l\'argent chez eux, c\'est révolutionnaire.'
        },
        {
          title: 'Super Rapide et Pas Cher',
          content: 'Les transactions Base sont confirmées en seulement 2 secondes et coûtent des fractions de centime. Plus besoin d\'attendre des jours pour les transferts d\'argent ou de payer des frais élevés.'
        },
        {
          title: 'Quiz Rapide',
          content: 'Testez vos connaissances',
          quizQuestion: {
            question: 'Combien coûte l\'envoi de 100$ sur Base?',
            options: ['15$', '5$', '0,01$', '1$'],
            correctAnswer: 2,
            explanation: 'Base facture moins de 0,01$ pour la plupart des transactions, ce qui la rend 1000 fois moins chère que les banques traditionnelles!'
          }
        }
      ]
    },
    sw: {
      title: 'Base ni Nini?',
      description: 'Jifunze misingi ya Base blockchain na kwa nini ni muhimu kwa Afrika',
      steps: [
        {
          title: 'Base ni Blockchain ya Safu ya 2',
          content: 'Base ni blockchain ya safu ya 2 iliyojengwa juu ya Ethereum na Coinbase. Fikiria kama toleo la Ethereum lenye kasi na bei nafuu, linalofaa kwa shughuli za kila siku.'
        },
        {
          title: 'Kwa Nini Base ni Muhimu kwa Afrika',
          content: 'Base hufanya utumaji wa pesa kwa mipaka kuwa rahisi sana. Wakati benki za jadi zinatoza $10-15 kutuma $100, Base inatoza chini ya $0.01. Kwa Waafrika wanaotuma pesa nyumbani, hii ni mabadiliko ya maisha.'
        },
        {
          title: 'Haraka Sana na Rahisi',
          content: 'Shughuli za Base huthibitishwa kwa sekunde 2 tu na zinagharimu sehemu ndogo za senti. Hakuna tena kusubiri siku nyingi kwa uhamishaji wa pesa au kulipa ada za juu.'
        },
        {
          title: 'Jaribio la Haraka',
          content: 'Jaribu maarifa yako',
          quizQuestion: {
            question: 'Inagharimu kiasi gani kutuma $100 kwenye Base?',
            options: ['$15', '$5', '$0.01', '$1'],
            correctAnswer: 2,
            explanation: 'Base inatoza chini ya $0.01 kwa shughuli nyingi, na kufanya iwe rahisi mara 1000 kuliko benki za jadi!'
          }
        }
      ]
    }
  },
  'why-base-africa': {
    en: {
      title: 'Why Base is Perfect for Africa',
      description: 'Discover how Base solves real problems for Africans',
      steps: [
        {
          title: 'The Remittance Problem',
          content: 'Every year, Africans abroad send over $100 billion home. But traditional services like Western Union and banks charge 10-15% in fees. That\'s $10-15 for every $100 sent!'
        },
        {
          title: 'Base Solves This',
          content: 'With Base, sending $100 costs less than $0.01. A family sending $500 home monthly saves $75 in fees - that\'s $900 per year they can use for food, education, or healthcare.'
        },
        {
          title: 'No Bank Account Needed',
          content: 'Millions of Africans don\'t have bank accounts. With Base, you only need a smartphone and internet connection. It\'s like M-Pesa, but for the entire world.'
        },
        {
          title: 'Works on Any Phone',
          content: 'Base works on any smartphone - no need for expensive devices. This makes it accessible to millions of Africans who rely on mobile technology.'
        },
        {
          title: 'Quick Quiz',
          content: 'Test your knowledge',
          quizQuestion: {
            question: 'How much does a family save per year if they send $500 monthly on Base vs traditional services?',
            options: ['$50', '$900', '$200', '$1,200'],
            correctAnswer: 1,
            explanation: 'Traditional services charge ~$75/month ($15 per $500), while Base charges ~$0.05/month. That\'s $900 saved per year!'
          }
        }
      ]
    },
    fr: {
      title: 'Pourquoi Base est Parfait pour l\'Afrique',
      description: 'Découvrez comment Base résout les vrais problèmes des Africains',
      steps: [
        {
          title: 'Le Problème des Envois de Fonds',
          content: 'Chaque année, les Africains à l\'étranger envoient plus de 100 milliards de dollars chez eux. Mais les services traditionnels comme Western Union et les banques facturent 10-15% de frais. C\'est 10-15$ pour chaque 100$ envoyé!'
        },
        {
          title: 'Base Résout Ceci',
          content: 'Avec Base, envoyer 100$ coûte moins de 0,01$. Une famille qui envoie 500$ par mois chez elle économise 75$ en frais - c\'est 900$ par an qu\'elle peut utiliser pour la nourriture, l\'éducation ou les soins de santé.'
        },
        {
          title: 'Pas Besoin de Compte Bancaire',
          content: 'Des millions d\'Africains n\'ont pas de compte bancaire. Avec Base, vous n\'avez besoin que d\'un smartphone et d\'une connexion internet. C\'est comme M-Pesa, mais pour le monde entier.'
        },
        {
          title: 'Fonctionne sur N\'importe Quel Téléphone',
          content: 'Base fonctionne sur n\'importe quel smartphone - pas besoin d\'appareils coûteux. Cela le rend accessible à des millions d\'Africains qui dépendent de la technologie mobile.'
        },
        {
          title: 'Quiz Rapide',
          content: 'Testez vos connaissances',
          quizQuestion: {
            question: 'Combien une famille économise-t-elle par an si elle envoie 500$ par mois sur Base par rapport aux services traditionnels?',
            options: ['50$', '900$', '200$', '1200$'],
            correctAnswer: 1,
            explanation: 'Les services traditionnels facturent ~75$/mois (15$ par 500$), tandis que Base facture ~0,05$/mois. C\'est 900$ économisés par an!'
          }
        }
      ]
    },
    sw: {
      title: 'Kwa Nini Base ni Bora kwa Afrika',
      description: 'Gundua jinsi Base inavyotatua matatizo halisi kwa Waafrika',
      steps: [
        {
          title: 'Tatizo la Uhamishaji wa Fedha',
          content: 'Kila mwaka, Waafrika nje ya nchi hutuma zaidi ya dola bilioni 100 nyumbani. Lakini huduma za jadi kama Western Union na benki zinatoza 10-15% ada. Hiyo ni $10-15 kwa kila $100 inayotumwa!'
        },
        {
          title: 'Base Inatatua Hili',
          content: 'Kwa Base, kutuma $100 kunagharimu chini ya $0.01. Familia inayotuma $500 kila mwezi nyumbani inaokoa $75 kwa ada - hiyo ni $900 kwa mwaka wanaweza kutumia kwa chakula, elimu, au huduma za afya.'
        },
        {
          title: 'Hakuna Hitaji la Akaunti ya Benki',
          content: 'Mamilioni ya Waafrika hawana akaunti za benki. Kwa Base, unahitaji tu simu ya mkononi na muunganisho wa intaneti. Ni kama M-Pesa, lakini kwa ulimwengu mzima.'
        },
        {
          title: 'Hufanya Kazi kwa Simu Yoyote',
          content: 'Base hufanya kazi kwa simu yoyote ya mkononi - hakuna haja ya vifaa vya bei ghali. Hii inafanya iwe rahisi kufikia mamilioni ya Waafrika wanaotegemea teknolojia ya mkononi.'
        },
        {
          title: 'Jaribio la Haraka',
          content: 'Jaribu maarifa yako',
          quizQuestion: {
            question: 'Familia inaokoa kiasi gani kwa mwaka ikiwa inatuma $500 kila mwezi kwa Base dhidi ya huduma za jadi?',
            options: ['$50', '$900', '$200', '$1,200'],
            correctAnswer: 1,
            explanation: 'Huduma za jadi zinatoza ~$75/mwezi ($15 kwa kila $500), wakati Base inatoza ~$0.05/mwezi. Hiyo ni $900 iliyookolewa kwa mwaka!'
          }
        }
      ]
    }
  },
  'base-vs-banking': {
    en: {
      title: 'Base vs Traditional Banking',
      description: 'See the real cost difference for African users',
      steps: [
        {
          title: 'Cost Comparison',
          content: 'Let\'s compare real costs for sending money to Africa:'
        },
        {
          title: 'Sending $100 to Kenya',
          content: 'Traditional Bank: $15 fee (15%)\nWestern Union: $12 fee (12%)\nMoneyGram: $10 fee (10%)\nBase: $0.01 fee (0.01%)\n\nYou save $9.99-14.99 per transaction!'
        },
        {
          title: 'Receiving $500 from Abroad',
          content: 'Traditional Bank: $25 fee + 3-5 days wait\nWestern Union: $20 fee + 1-2 days wait\nBase: $0.01 fee + 2 seconds\n\nYou save $19.99-24.99 and get your money instantly!'
        },
        {
          title: 'Quick Quiz',
          content: 'Test your knowledge',
          quizQuestion: {
            question: 'How much faster is Base compared to traditional banks for money transfers?',
            options: ['10x faster', '100x faster', '1000x faster', 'Same speed'],
            correctAnswer: 2,
            explanation: 'Base takes 2 seconds while banks take 3-5 days. That\'s over 1000x faster!'
          }
        }
      ]
    },
    fr: {
      title: 'Base contre les Banques Traditionnelles',
      description: 'Découvrez la vraie différence de coût pour les utilisateurs africains',
      steps: [
        {
          title: 'Comparaison des Coûts',
          content: 'Comparons les vrais coûts pour envoyer de l\'argent en Afrique:'
        },
        {
          title: 'Envoyer 100$ au Kenya',
          content: 'Banque Traditionnelle: 15$ de frais (15%)\nWestern Union: 12$ de frais (12%)\nMoneyGram: 10$ de frais (10%)\nBase: 0,01$ de frais (0,01%)\n\nVous économisez 9,99-14,99$ par transaction!'
        },
        {
          title: 'Recevoir 500$ de l\'Étranger',
          content: 'Banque Traditionnelle: 25$ de frais + attente de 3-5 jours\nWestern Union: 20$ de frais + attente de 1-2 jours\nBase: 0,01$ de frais + 2 secondes\n\nVous économisez 19,99-24,99$ et recevez votre argent instantanément!'
        },
        {
          title: 'Quiz Rapide',
          content: 'Testez vos connaissances',
          quizQuestion: {
            question: 'Base est combien de fois plus rapide que les banques traditionnelles pour les transferts d\'argent?',
            options: ['10 fois plus rapide', '100 fois plus rapide', '1000 fois plus rapide', 'Même vitesse'],
            correctAnswer: 2,
            explanation: 'Base prend 2 secondes tandis que les banques prennent 3-5 jours. C\'est plus de 1000 fois plus rapide!'
          }
        }
      ]
    },
    sw: {
      title: 'Base dhidi ya Benki za Jadi',
      description: 'Ona tofauti halisi ya gharama kwa watumiaji wa Kiafrika',
      steps: [
        {
          title: 'Kulinganisha Gharama',
          content: 'Wacha tulinganishe gharama halisi za kutuma pesa Afrika:'
        },
        {
          title: 'Kutuma $100 Kenya',
          content: 'Benki ya Jadi: Ada $15 (15%)\nWestern Union: Ada $12 (12%)\nMoneyGram: Ada $10 (10%)\nBase: Ada $0.01 (0.01%)\n\nUnaokoa $9.99-14.99 kwa kila shughuli!'
        },
        {
          title: 'Kupokea $500 Kutoka Nje',
          content: 'Benki ya Jadi: Ada $25 + kusubiri siku 3-5\nWestern Union: Ada $20 + kusubiri siku 1-2\nBase: Ada $0.01 + sekunde 2\n\nUnaokoa $19.99-24.99 na kupokea pesa zako mara moja!'
        },
        {
          title: 'Jaribio la Haraka',
          content: 'Jaribu maarifa yako',
          quizQuestion: {
            question: 'Base ni haraka mara ngapi ikilinganishwa na benki za jadi kwa uhamishaji wa pesa?',
            options: ['Mara 10 haraka', 'Mara 100 haraka', 'Mara 1000 haraka', 'Kasi sawa'],
            correctAnswer: 2,
            explanation: 'Base inachukua sekunde 2 wakati benki zinachukua siku 3-5. Hiyo ni zaidi ya mara 1000 haraka!'
          }
        }
      ]
    }
  },
  'send-money-family': {
    en: {
      title: 'Send Money to Family in Africa',
      description: 'Step-by-step guide to sending money home',
      steps: [
        {
          title: 'Step 1: Get Base ETH',
          content: 'You need a small amount of ETH on Base to pay for gas fees (usually less than $0.01). You can buy it on Coinbase, bridge from Ethereum, or receive it from a friend.'
        },
        {
          title: 'Step 2: Get Your Family\'s Wallet Address',
          content: 'Ask your family to create a Base wallet and share their wallet address (it looks like 0x...). This is like their bank account number, but for crypto.'
        },
        {
          title: 'Step 3: Send USDC',
          content: 'Buy USDC on Base (it\'s a stablecoin worth exactly $1). Then send it to your family\'s wallet address. The transaction takes 2 seconds and costs less than $0.01.'
        },
        {
          title: 'Step 4: Your Family Receives It',
          content: 'Your family sees the USDC in their wallet instantly. They can either:\n1. Keep it as USDC (it stays at $1)\n2. Swap it for local currency\n3. Send it to others'
        },
        {
          title: 'Quick Quiz',
          content: 'Test your knowledge',
          quizQuestion: {
            question: 'How long does it take to send money on Base?',
            options: ['2 seconds', '2 minutes', '2 hours', '2 days'],
            correctAnswer: 0,
            explanation: 'Base transactions are confirmed in just 2 seconds, making it the fastest way to send money!'
          }
        }
      ]
    },
    fr: {
      title: 'Envoyer de l\'Argent à la Famille en Afrique',
      description: 'Guide étape par étape pour envoyer de l\'argent chez soi',
      steps: [
        {
          title: 'Étape 1: Obtenir de l\'ETH sur Base',
          content: 'Vous avez besoin d\'une petite quantité d\'ETH sur Base pour payer les frais de gaz (généralement moins de 0,01$). Vous pouvez l\'acheter sur Coinbase, le transférer depuis Ethereum, ou le recevoir d\'un ami.'
        },
        {
          title: 'Étape 2: Obtenir l\'Adresse du Portefeuille de Votre Famille',
          content: 'Demandez à votre famille de créer un portefeuille Base et de partager leur adresse de portefeuille (elle ressemble à 0x...). C\'est comme leur numéro de compte bancaire, mais pour la crypto.'
        },
        {
          title: 'Étape 3: Envoyer de l\'USDC',
          content: 'Achetez de l\'USDC sur Base (c\'est une cryptomonnaie stable qui vaut exactement 1$). Ensuite, envoyez-le à l\'adresse du portefeuille de votre famille. La transaction prend 2 secondes et coûte moins de 0,01$.'
        },
        {
          title: 'Étape 4: Votre Famille le Reçoit',
          content: 'Votre famille voit l\'USDC dans son portefeuille instantanément. Ils peuvent soit:\n1. Le garder en USDC (il reste à 1$)\n2. L\'échanger contre la monnaie locale\n3. L\'envoyer à d\'autres'
        },
        {
          title: 'Quiz Rapide',
          content: 'Testez vos connaissances',
          quizQuestion: {
            question: 'Combien de temps faut-il pour envoyer de l\'argent sur Base?',
            options: ['2 secondes', '2 minutes', '2 heures', '2 jours'],
            correctAnswer: 0,
            explanation: 'Les transactions Base sont confirmées en seulement 2 secondes, ce qui en fait le moyen le plus rapide d\'envoyer de l\'argent!'
          }
        }
      ]
    },
    sw: {
      title: 'Tuma Pesa kwa Familia Afrika',
      description: 'Mwongozo hatua kwa hatua wa kutuma pesa nyumbani',
      steps: [
        {
          title: 'Hatua ya 1: Pata Base ETH',
          content: 'Unahitaji kiasi kidogo cha ETH kwenye Base kulipa ada za gesi (kwa kawaida chini ya $0.01). Unaweza kukinunua kwenye Coinbase, kukihamisha kutoka Ethereum, au kuupokea kutoka kwa rafiki.'
        },
        {
          title: 'Hatua ya 2: Pata Anwani ya Mkoba wa Familia Yako',
          content: 'Waombe familia yako kuunda mkoba wa Base na kushiriki anwani yao ya mkoba (inaonekana kama 0x...). Hii ni kama nambari yao ya akaunti ya benki, lakini kwa crypto.'
        },
        {
          title: 'Hatua ya 3: Tuma USDC',
          content: 'Nunua USDC kwenye Base (ni sarafu imara yenye thamani sawa na $1). Kisha utume kwa anwani ya mkoba wa familia yako. Shughuli huchukua sekunde 2 na inagharimu chini ya $0.01.'
        },
        {
          title: 'Hatua ya 4: Familia Yako Inaipokea',
          content: 'Familia yako inaona USDC kwenye mkoba wao mara moja. Wanaweza:\n1. Kuiweka kama USDC (inabaki $1)\n2. Kuiingiza kwa sarafu ya ndani\n3. Kuituma kwa wengine'
        },
        {
          title: 'Jaribio la Haraka',
          content: 'Jaribu maarifa yako',
          quizQuestion: {
            question: 'Inachukua muda gani kutuma pesa kwenye Base?',
            options: ['Sekunde 2', 'Dakika 2', 'Masaa 2', 'Siku 2'],
            correctAnswer: 0,
            explanation: 'Shughuli za Base huthibitishwa kwa sekunde 2 tu, na kufanya iwe njia ya haraka zaidi ya kutuma pesa!'
          }
        }
      ]
    }
  },
  'base-defi': {
    en: {
      title: 'Base DeFi for Africans',
      description: 'Learn how to earn interest and borrow on Base',
      steps: [
        {
          title: 'What is DeFi?',
          content: 'DeFi (Decentralized Finance) lets you earn interest, borrow money, and trade without banks. On Base, DeFi is super cheap and fast.'
        },
        {
          title: 'Earn Interest',
          content: 'Instead of keeping money in a bank that pays 1% interest, you can lend it on Base and earn 3-5% or more. Your money grows while you sleep!'
        },
        {
          title: 'Borrow Without Banks',
          content: 'Need a loan? On Base, you can borrow against your crypto without credit checks or banks. Perfect for African entrepreneurs who can\'t access traditional banking.'
        },
        {
          title: 'Quick Quiz',
          content: 'Test your knowledge',
          quizQuestion: {
            question: 'What is the main benefit of DeFi for Africans?',
            options: ['Higher interest rates', 'No bank account needed', 'Faster transactions', 'All of the above'],
            correctAnswer: 3,
            explanation: 'DeFi on Base offers all these benefits, making it perfect for Africans who lack access to traditional banking!'
          }
        }
      ]
    },
    fr: {
      title: 'DeFi sur Base pour les Africains',
      description: 'Apprenez à gagner des intérêts et à emprunter sur Base',
      steps: [
        {
          title: 'Qu\'est-ce que DeFi?',
          content: 'DeFi (Finance Décentralisée) vous permet de gagner des intérêts, d\'emprunter de l\'argent et de trader sans banques. Sur Base, DeFi est super bon marché et rapide.'
        },
        {
          title: 'Gagner des Intérêts',
          content: 'Au lieu de garder votre argent dans une banque qui paie 1% d\'intérêts, vous pouvez le prêter sur Base et gagner 3-5% ou plus. Votre argent pousse pendant que vous dormez!'
        },
        {
          title: 'Emprunter sans Banques',
          content: 'Besoin d\'un prêt? Sur Base, vous pouvez emprunter contre votre crypto sans vérification de crédit ou banques. Parfait pour les entrepreneurs africains qui ne peuvent pas accéder au système bancaire traditionnel.'
        },
        {
          title: 'Quiz Rapide',
          content: 'Testez vos connaissances',
          quizQuestion: {
            question: 'Quel est le principal avantage de DeFi pour les Africains?',
            options: ['Taux d\'intérêt plus élevés', 'Pas besoin de compte bancaire', 'Transactions plus rapides', 'Tout ce qui précède'],
            correctAnswer: 3,
            explanation: 'DeFi sur Base offre tous ces avantages, ce qui le rend parfait pour les Africains qui n\'ont pas accès au système bancaire traditionnel!'
          }
        }
      ]
    },
    sw: {
      title: 'Base DeFi kwa Waafrika',
      description: 'Jifunze jinsi ya kupata riba na kukopa kwenye Base',
      steps: [
        {
          title: 'DeFi ni Nini?',
          content: 'DeFi (Fedha Zisizo na Kituo Kimoja) hukuruhusu kupata riba, kukopa pesa, na kufanya biashara bila benki. Kwenye Base, DeFi ni rahisi sana na haraka.'
        },
        {
          title: 'Pata Riba',
          content: 'Badala ya kuweka pesa benki inayotoa riba 1%, unaweza kuikopesha kwenye Base na kupata 3-5% au zaidi. Pesa zako zinakua wakati unalala!'
        },
        {
          title: 'Kopa bila Benki',
          content: 'Unahitaji mkopo? Kwenye Base, unaweza kukopa kwa kutumia crypto yako bila ukaguzi wa mkopo au benki. Bora kwa wajasiriamali wa Kiafrika ambao hawawezi kufikia benki za jadi.'
        },
        {
          title: 'Jaribio la Haraka',
          content: 'Jaribu maarifa yako',
          quizQuestion: {
            question: 'Faida kuu ya DeFi kwa Waafrika ni nini?',
            options: ['Viwango vya riba vya juu', 'Hakuna haja ya akaunti ya benki', 'Shughuli za haraka', 'Yote hapo juu'],
            correctAnswer: 3,
            explanation: 'DeFi kwenye Base hutoa faida hizi zote, na kufanya iwe bora kwa Waafrika ambao hawana ufikiaji wa benki za jadi!'
          }
        }
      ]
    }
  }
}

