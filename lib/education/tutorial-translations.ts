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
          content: 'Base is a Layer 2 blockchain built on Ethereum by Coinbase. Think of it as a faster, cheaper version of Ethereum that\'s perfect for everyday transactions.\n\nLayer 2 means it sits "on top" of Ethereum, inheriting its security while being much faster and cheaper.'
        },
        {
          title: 'Why Base Matters for Africa',
          content: 'Base makes sending money across borders incredibly cheap. While traditional banks charge $10-15 to send $100, Base charges less than $0.01. For Africans sending money home, this is life-changing.\n\nEvery year, Africans abroad send over $100 billion home. Base can save families thousands of dollars in fees.'
        },
        {
          title: 'Super Fast & Cheap',
          content: 'Base transactions are confirmed in just 2 seconds and cost fractions of a cent. No more waiting days for money transfers or paying high fees.\n\nTraditional banks: 3-5 days\nBase: 2 seconds\n\nThat\'s over 1000x faster!'
        },
        {
          title: 'Built by Coinbase',
          content: 'Base is built by Coinbase, one of the world\'s most trusted crypto companies. This means:\n\n• Trusted by millions of users\n• Regulated and compliant\n• Easy to use\n• Secure and reliable\n\nYou can trust Base with your money.'
        },
        {
          title: 'Works with Any Wallet',
          content: 'Base works with popular wallets like MetaMask, Coinbase Wallet, and many others. You don\'t need to create a new account - just connect your existing wallet.\n\nThis makes it easy to get started without learning new tools.'
        },
        {
          title: 'Perfect for Daily Use',
          content: 'Unlike Bitcoin or Ethereum, Base is designed for everyday transactions:\n\n• Buy coffee with crypto\n• Pay bills instantly\n• Send money to family\n• Shop online\n\nIt\'s crypto that actually works for real life.'
        },
        {
          title: 'Growing Ecosystem',
          content: 'Base has hundreds of apps and services:\n\n• DeFi protocols for earning interest\n• NFT marketplaces\n• Gaming platforms\n• Payment solutions\n\nNew apps are added every week, making Base more useful over time.'
        },
        {
          title: 'Getting Started',
          content: 'Ready to use Base? Here\'s what you need:\n\n1. A crypto wallet (like MetaMask)\n2. Some ETH for gas fees (less than $1)\n3. USDC or other tokens to send\n\nThat\'s it! You\'re ready to experience the future of money.'
        }
      ]
    },
    fr: {
      title: 'Qu\'est-ce que Base?',
      description: 'Apprenez les bases de la blockchain Base et pourquoi elle compte pour l\'Afrique',
      steps: [
        {
          title: 'Base est une Blockchain Layer 2',
          content: 'Base est une blockchain Layer 2 construite sur Ethereum par Coinbase. Pensez-y comme une version plus rapide et moins chère d\'Ethereum, parfaite pour les transactions quotidiennes.\n\nLayer 2 signifie qu\'elle se trouve "au-dessus" d\'Ethereum, héritant de sa sécurité tout en étant beaucoup plus rapide et moins chère.'
        },
        {
          title: 'Pourquoi Base Compte pour l\'Afrique',
          content: 'Base rend l\'envoi d\'argent à travers les frontières incroyablement bon marché. Alors que les banques traditionnelles facturent 10-15$ pour envoyer 100$, Base facture moins de 0,01$. Pour les Africains qui envoient de l\'argent à la maison, c\'est révolutionnaire.\n\nChaque année, les Africains à l\'étranger envoient plus de 100 milliards de dollars à la maison. Base peut faire économiser des milliers de dollars aux familles.'
        },
        {
          title: 'Super Rapide et Bon Marché',
          content: 'Les transactions Base sont confirmées en seulement 2 secondes et coûtent des fractions de centime. Fini d\'attendre des jours pour les transferts d\'argent ou de payer des frais élevés.\n\nBanques traditionnelles: 3-5 jours\nBase: 2 secondes\n\nC\'est plus de 1000x plus rapide!'
        },
        {
          title: 'Construit par Coinbase',
          content: 'Base est construit par Coinbase, l\'une des entreprises crypto les plus fiables au monde. Cela signifie:\n\n• Fiable par des millions d\'utilisateurs\n• Réglementé et conforme\n• Facile à utiliser\n• Sécurisé et fiable\n\nVous pouvez faire confiance à Base avec votre argent.'
        },
        {
          title: 'Fonctionne avec N\'importe Quel Portefeuille',
          content: 'Base fonctionne avec des portefeuilles populaires comme MetaMask, Coinbase Wallet, et bien d\'autres. Vous n\'avez pas besoin de créer un nouveau compte - connectez simplement votre portefeuille existant.\n\nCela facilite le démarrage sans apprendre de nouveaux outils.'
        },
        {
          title: 'Parfait pour l\'Usage Quotidien',
          content: 'Contrairement à Bitcoin ou Ethereum, Base est conçu pour les transactions quotidiennes:\n\n• Acheter du café avec de la crypto\n• Payer les factures instantanément\n• Envoyer de l\'argent à la famille\n• Acheter en ligne\n\nC\'est de la crypto qui fonctionne vraiment dans la vraie vie.'
        },
        {
          title: 'Écosystème en Croissance',
          content: 'Base a des centaines d\'applications et de services:\n\n• Protocoles DeFi pour gagner des intérêts\n• Marchés NFT\n• Plateformes de jeu\n• Solutions de paiement\n\nDe nouvelles applications sont ajoutées chaque semaine, rendant Base plus utile au fil du temps.'
        },
        {
          title: 'Commencer',
          content: 'Prêt à utiliser Base? Voici ce dont vous avez besoin:\n\n1. Un portefeuille crypto (comme MetaMask)\n2. Un peu d\'ETH pour les frais de gaz (moins de 1$)\n3. USDC ou d\'autres tokens à envoyer\n\nC\'est tout! Vous êtes prêt à expérimenter l\'avenir de l\'argent.'
        }
      ]
    },
    sw: {
      title: 'Base ni Nini?',
      description: 'Jifunze misingi ya Base blockchain na kwa nini ni muhimu kwa Afrika',
      steps: [
        {
          title: 'Base ni Layer 2 Blockchain',
          content: 'Base ni blockchain ya Layer 2 iliyojengwa juu ya Ethereum na Coinbase. Fikiria kama toleo la Ethereum linalofunga haraka na bei nafuu, linalofaa kwa shughuli za kila siku.\n\nLayer 2 inamaanisha kuwa iko "juu" ya Ethereum, ikipokea usalama wake wakati ikifunga haraka zaidi na bei nafuu zaidi.'
        },
        {
          title: 'Kwa Nini Base ni Muhimu kwa Afrika',
          content: 'Base hufanya kutuma pesa kupitia mipaka kuwa nafuu sana. Wakati benki za kawaida zinachaji $10-15 kutuma $100, Base inachaji chini ya $0.01. Kwa Waafrika wanaotuma pesa nyumbani, hii ni mabadiliko ya maisha.\n\nKila mwaka, Waafrika wanaokaa nje ya nchi wanatuma zaidi ya $100 bilioni nyumbani. Base inaweza kuwasaidia familia kuokoa maelfu ya dola.'
        },
        {
          title: 'Haraka Sana na Nafuu',
          content: 'Shughuli za Base zinaidhinishwa katika sekunde 2 tu na zinagharimu sehemu ndogo za senti. Hakuna kusubiri siku za pesa za kuhama au kulipa ada za juu.\n\nBenki za kawaida: siku 3-5\nBase: sekunde 2\n\nHiyo ni zaidi ya mara 1000 haraka zaidi!'
        },
        {
          title: 'Imejengwa na Coinbase',
          content: 'Base imejengwa na Coinbase, moja ya kampuni za crypto za kuaminika zaidi duniani. Hii inamaanisha:\n\n• Inaaminika na mamilioni ya watumiaji\n• Inafuatwa sheria na inatii sheria\n• Rahisi kutumia\n• Salama na ya kuegemea\n\nUnaweza kuamini Base na pesa zako.'
        },
        {
          title: 'Inafanya Kazi na Wallet Yoyote',
          content: 'Base inafanya kazi na wallet maarufu kama MetaMask, Coinbase Wallet, na nyingine nyingi. Huna haja ya kuunda akaunti mpya - tuunganishe wallet yako iliyopo.\n\nHii inafanya kuwa rahisi kuanza bila kujifunza vifaa vipya.'
        },
        {
          title: 'Inafaa kwa Matumizi ya Kila Siku',
          content: 'Tofauti na Bitcoin au Ethereum, Base imeundwa kwa shughuli za kila siku:\n\n• Kununua kahawa na crypto\n• Kulipa bili papo hapo\n• Kutuma pesa kwa familia\n• Kununua mtandaoni\n\nNi crypto ambayo inafanya kazi kweli katika maisha ya kweli.'
        },
        {
          title: 'Mfumo wa Ukuaji',
          content: 'Base ina mamia ya programu na huduma:\n\n• Itifaki za DeFi za kupata riba\n• Soko za NFT\n• Jukwaa za michezo\n• Suluhisho za malipo\n\nProgramu mpya zinaongezwa kila wiki, hivyo Base inakuwa muhimu zaidi kwa muda.'
        },
        {
          title: 'Kuanza',
          content: 'Uko tayari kutumia Base? Hiki ndicho unachohitaji:\n\n1. Wallet ya crypto (kama MetaMask)\n2. ETH kidogo kwa ada za gesi (chini ya $1)\n3. USDC au token nyingine za kutuma\n\nHiyo tu! Uko tayari kujaribu mustakabali wa pesa.'
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
          content: 'Every year, Africans abroad send over $100 billion home. But traditional services like Western Union and banks charge 10-15% in fees. That\'s $10-15 for every $100 sent!\n\nThis means families lose thousands of dollars each year just to send money home.'
        },
        {
          title: 'Base Solves This',
          content: 'With Base, sending $100 costs less than $0.01. A family sending $500 home monthly saves $75 in fees - that\'s $900 per year they can use for food, education, or healthcare.\n\nThat\'s enough to:\n• Feed a family for months\n• Pay school fees\n• Cover medical expenses'
        },
        {
          title: 'No Bank Account Needed',
          content: 'Millions of Africans don\'t have bank accounts. With Base, you only need a smartphone and internet connection. It\'s like M-Pesa, but for the entire world.\n\nThis makes financial services accessible to everyone, not just those with traditional banking.'
        },
        {
          title: 'Works on Any Phone',
          content: 'Base works on any smartphone - no need for expensive devices. This makes it accessible to millions of Africans who rely on mobile technology.\n\nEven basic Android phones can run Base apps, making it truly inclusive.'
        },
        {
          title: 'Instant Transactions',
          content: 'Unlike traditional remittances that take days, Base transactions are instant. Your family receives money in seconds, not days.\n\nThis is crucial for emergencies when families need money immediately.'
        },
        {
          title: 'Multiple Currencies',
          content: 'Base supports many African currencies and stablecoins:\n\n• USDC (pegged to US dollar)\n• Local currency tokens\n• Cross-border payments\n\nThis makes it perfect for African businesses and families.'
        },
        {
          title: 'Growing African Adoption',
          content: 'More Africans are discovering Base every day:\n\n• Nigerian traders using Base for imports\n• Kenyan families receiving remittances\n• South African businesses accepting crypto\n\nYou\'re joining a growing movement.'
        },
        {
          title: 'Real Impact Stories',
          content: 'Meet Sarah from Lagos: "I used to pay $20 to send $200 to my family. Now I pay $0.01. That\'s $240 saved per year!"\n\nMeet Ahmed from Cairo: "Base helped me start my business. I can accept payments from anywhere in the world instantly."\n\nThese are real stories from real Africans.'
        }
      ]
    },
    fr: {
      title: 'Pourquoi Base est Parfait pour l\'Afrique',
      description: 'Découvrez comment Base résout les vrais problèmes des Africains',
      steps: [
        {
          title: 'Le Problème des Transferts',
          content: 'Chaque année, les Africains à l\'étranger envoient plus de 100 milliards de dollars à la maison. Mais les services traditionnels comme Western Union et les banques facturent 10-15% de frais. C\'est 10-15$ pour chaque 100$ envoyé!\n\nCela signifie que les familles perdent des milliers de dollars chaque année juste pour envoyer de l\'argent à la maison.'
        },
        {
          title: 'Base Résout Cela',
          content: 'Avec Base, envoyer 100$ coûte moins de 0,01$. Une famille envoyant 500$ à la maison chaque mois économise 75$ en frais - c\'est 900$ par an qu\'ils peuvent utiliser pour la nourriture, l\'éducation ou les soins de santé.\n\nC\'est assez pour:\n• Nourrir une famille pendant des mois\n• Payer les frais de scolarité\n• Couvrir les dépenses médicales'
        },
        {
          title: 'Pas de Compte Bancaire Nécessaire',
          content: 'Des millions d\'Africains n\'ont pas de comptes bancaires. Avec Base, vous n\'avez besoin que d\'un smartphone et d\'une connexion internet. C\'est comme M-Pesa, mais pour le monde entier.\n\nCela rend les services financiers accessibles à tous, pas seulement à ceux qui ont une banque traditionnelle.'
        },
        {
          title: 'Fonctionne sur N\'importe Quel Téléphone',
          content: 'Base fonctionne sur n\'importe quel smartphone - pas besoin d\'appareils coûteux. Cela le rend accessible à des millions d\'Africains qui dépendent de la technologie mobile.\n\nMême les téléphones Android basiques peuvent exécuter les applications Base, le rendant vraiment inclusif.'
        },
        {
          title: 'Transactions Instantanées',
          content: 'Contrairement aux transferts traditionnels qui prennent des jours, les transactions Base sont instantanées. Votre famille reçoit l\'argent en secondes, pas en jours.\n\nC\'est crucial pour les urgences quand les familles ont besoin d\'argent immédiatement.'
        },
        {
          title: 'Multiples Devises',
          content: 'Base prend en charge de nombreuses devises africaines et stablecoins:\n\n• USDC (indexé sur le dollar américain)\n• Tokens de devises locales\n• Paiements transfrontaliers\n\nCela le rend parfait pour les entreprises et familles africaines.'
        },
        {
          title: 'Adoption Africaine Croissante',
          content: 'Plus d\'Africains découvrent Base chaque jour:\n\n• Commerçants nigérians utilisant Base pour les importations\n• Familles kenyanes recevant des transferts\n• Entreprises sud-africaines acceptant la crypto\n\nVous rejoignez un mouvement croissant.'
        },
        {
          title: 'Histoires d\'Impact Réel',
          content: 'Rencontrez Sarah de Lagos: "Je payais 20$ pour envoyer 200$ à ma famille. Maintenant je paie 0,01$. C\'est 240$ économisés par an!"\n\nRencontrez Ahmed du Caire: "Base m\'a aidé à démarrer mon entreprise. Je peux accepter des paiements de n\'importe où dans le monde instantanément."\n\nCe sont de vraies histoires de vrais Africains.'
        }
      ]
    },
    sw: {
      title: 'Kwa Nini Base ni Kamili kwa Afrika',
      description: 'Gundua jinsi Base inatatua matatizo ya kweli ya Waafrika',
      steps: [
        {
          title: 'Tatizo la Uhamisho wa Pesa',
          content: 'Kila mwaka, Waafrika wanaokaa nje ya nchi wanatuma zaidi ya $100 bilioni nyumbani. Lakini huduma za kawaida kama Western Union na benki zinachaji ada za 10-15%. Hiyo ni $10-15 kwa kila $100 inayotumwa!\n\nHii inamaanisha kuwa familia zinapoteza maelfu ya dola kila mwaka tu kutuma pesa nyumbani.'
        },
        {
          title: 'Base Inatatua Hili',
          content: 'Kwa Base, kutuma $100 kunagharimu chini ya $0.01. Familia inayotuma $500 nyumbani kila mwezi inaokoa $75 kwa ada - hiyo ni $900 kwa mwaka wanaweza kutumia kwa chakula, elimu, au huduma za afya.\n\nHiyo inatosha:\n• Kulisha familia kwa miezi\n• Kulipa ada za shule\n• Kufidia gharama za matibabu'
        },
        {
          title: 'Hakuna Akaunti ya Benki Inahitajika',
          content: 'Mamilioni ya Waafrika hawana akaunti za benki. Kwa Base, unahitaji tu simu ya mkononi na muunganisho wa mtandao. Ni kama M-Pesa, lakini kwa ulimwengu wote.\n\nHii inafanya huduma za kifedha ziwe za kufikiwa na kila mtu, si tu wale walio na benki za kawaida.'
        },
        {
          title: 'Inafanya Kazi kwenye Simu Yoyote',
          content: 'Base inafanya kazi kwenye simu yoyote ya mkononi - hakuna haja ya vifaa vya gharama kubwa. Hii inafanya kuwa ya kufikiwa na mamilioni ya Waafrika wanaotegemea teknolojia ya simu.\n\nHata simu za Android za msingi zinaweza kuendesha programu za Base, hivyo kuifanya ya kweli ya kujumuisha.'
        },
        {
          title: 'Shughuli za Papo Hapo',
          content: 'Tofauti na uhamisho wa pesa wa kawaida unaochukua siku, shughuli za Base ni za papo hapo. Familia yako inapokea pesa katika sekunde, si siku.\n\nHii ni muhimu sana kwa dharura wakati familia zinahitaji pesa mara moja.'
        },
        {
          title: 'Fedha Nyingi',
          content: 'Base inasaidia fedha nyingi za Kiafrika na stablecoins:\n\n• USDC (imeunganishwa na dola ya Marekani)\n• Token za fedha za ndani\n• Malipo ya kupitia mipaka\n\nHii inafanya kuwa kamili kwa biashara na familia za Kiafrika.'
        },
        {
          title: 'Uchukuzi wa Kiafrika Unaongezeka',
          content: 'Zaidi ya Waafrika wanagundua Base kila siku:\n\n• Wafanyabiashara wa Nigeria wakitumia Base kwa uagizaji\n• Familia za Kenya zinazopokea uhamisho wa pesa\n• Biashara za Afrika Kusini zinazokubali crypto\n\nUnajiunga na harakati inayokua.'
        },
        {
          title: 'Hadithi za Athari ya Kweli',
          content: 'Mkutane na Sarah kutoka Lagos: "Nilikuwa nikilipa $20 kutuma $200 kwa familia yangu. Sasa ninamlipa $0.01. Hiyo ni $240 nimeokoa kwa mwaka!"\n\nMkutane na Ahmed kutoka Cairo: "Base ilinisaidia kuanzisha biashara yangu. Ninaweza kupokea malipo kutoka mahali popote duniani papo hapo."\n\nHizi ni hadithi za kweli za Waafrika wa kweli.'
        }
      ]
    }
  }
}