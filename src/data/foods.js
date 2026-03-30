const foods = [
  // Carnes e proteínas
  { id: 1, name: "Peito de frango (cozido)", cal: 165, p: 31, c: 0, f: 3.6 },
  { id: 2, name: "Coxa de frango (cozida)", cal: 209, p: 26, c: 0, f: 11 },
  { id: 3, name: "Carne moída patinho (cozida)", cal: 219, p: 27, c: 0, f: 12 },
  { id: 4, name: "Bife de alcatra (grelhado)", cal: 211, p: 29, c: 0, f: 10 },
  { id: 5, name: "Bife de fraldinha (grelhado)", cal: 225, p: 28, c: 0, f: 12 },
  { id: 6, name: "Filé de tilápia (grelhado)", cal: 128, p: 26, c: 0, f: 2.7 },
  { id: 7, name: "Salmão (grelhado)", cal: 208, p: 20, c: 0, f: 13 },
  { id: 8, name: "Atum (lata, em água)", cal: 116, p: 25.5, c: 0, f: 1 },
  { id: 9, name: "Ovo inteiro (cozido)", cal: 155, p: 13, c: 1.1, f: 11, unit: "unidade", gramsPerUnit: 50 },
  { id: 10, name: "Clara de ovo (cozida)", cal: 52, p: 11, c: 0.7, f: 0.2, unit: "unidade", gramsPerUnit: 33 },
  { id: 11, name: "Whey protein (pó)", cal: 400, p: 80, c: 8, f: 5 },
  { id: 12, name: "Linguiça toscana (grelhada)", cal: 280, p: 16, c: 2, f: 23 },
  { id: 13, name: "Peito de peru (fatiado)", cal: 109, p: 18, c: 3, f: 3, unit: "fatia", gramsPerUnit: 15 },
  { id: 14, name: "Sardinha (lata, em óleo)", cal: 208, p: 24, c: 0, f: 12 },

  // Carboidratos e grãos
  { id: 15, name: "Arroz branco (cozido)", cal: 130, p: 2.7, c: 28, f: 0.3 },
  { id: 16, name: "Arroz integral (cozido)", cal: 123, p: 2.7, c: 25.6, f: 1 },
  { id: 17, name: "Feijão carioca (cozido)", cal: 127, p: 8.7, c: 22.8, f: 0.5 },
  { id: 18, name: "Feijão preto (cozido)", cal: 132, p: 8.9, c: 24, f: 0.5 },
  { id: 19, name: "Lentilha (cozida)", cal: 116, p: 9, c: 20, f: 0.4 },
  { id: 20, name: "Macarrão (cozido)", cal: 131, p: 5, c: 25, f: 1.1 },
  { id: 21, name: "Macarrão integral (cozido)", cal: 124, p: 5.3, c: 23, f: 1.4 },
  { id: 22, name: "Aveia em flocos", cal: 389, p: 17, c: 66, f: 7 },
  { id: 23, name: "Pão francês", cal: 299, p: 9, c: 58, f: 3, unit: "unidade", gramsPerUnit: 50 },
  { id: 24, name: "Pão de forma integral (fatia)", cal: 247, p: 10, c: 41, f: 5, unit: "fatia", gramsPerUnit: 25 },
  { id: 25, name: "Batata-doce (cozida)", cal: 86, p: 1.6, c: 20, f: 0.1 },
  { id: 26, name: "Batata inglesa (cozida)", cal: 87, p: 1.9, c: 20, f: 0.1 },
  { id: 27, name: "Mandioca (cozida)", cal: 125, p: 1, c: 30, f: 0.2 },
  { id: 28, name: "Tapioca (goma)", cal: 348, p: 0.2, c: 87, f: 0.1 },
  { id: 29, name: "Cuscuz de milho (cozido)", cal: 112, p: 2.4, c: 24, f: 0.7 },
  { id: 30, name: "Granola (tradicional)", cal: 471, p: 10, c: 64, f: 20 },

  // Frutas
  { id: 31, name: "Banana prata", cal: 98, p: 1.3, c: 26, f: 0.1, unit: "unidade", gramsPerUnit: 80 },
  { id: 32, name: "Banana nanica", cal: 89, p: 1.1, c: 23, f: 0.3, unit: "unidade", gramsPerUnit: 70 },
  { id: 33, name: "Maçã (com casca)", cal: 52, p: 0.3, c: 14, f: 0.2, unit: "unidade", gramsPerUnit: 130 },
  { id: 34, name: "Mamão papaia", cal: 43, p: 0.5, c: 11, f: 0.3 },
  { id: 35, name: "Manga palmer", cal: 65, p: 0.5, c: 17, f: 0.3, unit: "unidade", gramsPerUnit: 200 },
  { id: 36, name: "Abacaxi", cal: 50, p: 0.5, c: 13, f: 0.1 },
  { id: 37, name: "Laranja pera", cal: 47, p: 1, c: 11, f: 0.1, unit: "unidade", gramsPerUnit: 160 },
  { id: 38, name: "Melancia", cal: 30, p: 0.6, c: 8, f: 0.2 },
  { id: 39, name: "Uva itália", cal: 69, p: 0.6, c: 18, f: 0.4 },
  { id: 40, name: "Morango", cal: 32, p: 0.7, c: 7.7, f: 0.3, unit: "unidade", gramsPerUnit: 12 },
  { id: 41, name: "Abacate", cal: 160, p: 2, c: 9, f: 15, unit: "unidade", gramsPerUnit: 200 },
  { id: 42, name: "Goiaba", cal: 68, p: 2.6, c: 14, f: 1, unit: "unidade", gramsPerUnit: 100 },
  { id: 43, name: "Maracujá (polpa)", cal: 68, p: 2.4, c: 13, f: 1.7, unit: "unidade", gramsPerUnit: 60 },

  // Laticínios
  { id: 44, name: "Leite integral", cal: 61, p: 3.2, c: 4.8, f: 3.3 },
  { id: 45, name: "Leite desnatado", cal: 35, p: 3.4, c: 4.9, f: 0.1 },
  { id: 46, name: "Iogurte grego (natural)", cal: 59, p: 10, c: 3.6, f: 0.4 },
  { id: 47, name: "Iogurte natural integral", cal: 61, p: 3.5, c: 4.7, f: 3.3 },
  { id: 48, name: "Queijo cottage", cal: 98, p: 11, c: 3.4, f: 4.3 },
  { id: 49, name: "Queijo mussarela", cal: 300, p: 22, c: 2.2, f: 22, unit: "fatia", gramsPerUnit: 20 },
  { id: 50, name: "Queijo cheddar", cal: 402, p: 25, c: 1.3, f: 33, unit: "fatia", gramsPerUnit: 20 },
  { id: 51, name: "Requeijão cremoso", cal: 240, p: 8, c: 4, f: 21 },
  { id: 52, name: "Manteiga", cal: 717, p: 0.9, c: 0.1, f: 81 },

  // Vegetais
  { id: 53, name: "Brócolis (cozido)", cal: 35, p: 2.4, c: 7, f: 0.4 },
  { id: 54, name: "Espinafre (cru)", cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  { id: 55, name: "Alface (cru)", cal: 15, p: 1.4, c: 2.3, f: 0.2 },
  { id: 56, name: "Tomate (cru)", cal: 18, p: 0.9, c: 3.9, f: 0.2, unit: "unidade", gramsPerUnit: 100 },
  { id: 57, name: "Cenoura (cozida)", cal: 41, p: 0.9, c: 10, f: 0.2, unit: "unidade", gramsPerUnit: 80 },
  { id: 58, name: "Abobrinha (cozida)", cal: 17, p: 1.2, c: 3.6, f: 0.4 },
  { id: 59, name: "Couve (crua)", cal: 35, p: 3.3, c: 7, f: 0.7 },
  { id: 60, name: "Chuchu (cozido)", cal: 24, p: 0.8, c: 5.5, f: 0.3 },
  { id: 61, name: "Beterraba (cozida)", cal: 43, p: 1.6, c: 9.6, f: 0.2, unit: "unidade", gramsPerUnit: 80 },
  { id: 62, name: "Milho (cozido)", cal: 86, p: 3.3, c: 18.7, f: 1.4 },

  // Gorduras e oleaginosas
  { id: 63, name: "Azeite de oliva", cal: 884, p: 0, c: 0, f: 100 },
  { id: 64, name: "Óleo de coco", cal: 892, p: 0, c: 0, f: 99 },
  { id: 65, name: "Amendoim (torrado)", cal: 567, p: 26, c: 18, f: 49 },
  { id: 66, name: "Pasta de amendoim", cal: 588, p: 25, c: 20, f: 50 },
  { id: 67, name: "Amêndoas", cal: 579, p: 21, c: 22, f: 50, unit: "unidade", gramsPerUnit: 1.2 },
  { id: 68, name: "Castanha-do-pará", cal: 659, p: 14, c: 12, f: 67, unit: "unidade", gramsPerUnit: 5 },
  { id: 69, name: "Castanha de caju (torrada)", cal: 574, p: 15, c: 33, f: 46, unit: "unidade", gramsPerUnit: 3 },

  // Bebidas
  { id: 70, name: "Suco de laranja (natural)", cal: 45, p: 0.7, c: 10, f: 0.2 },
  { id: 71, name: "Leite de aveia", cal: 45, p: 1, c: 7, f: 1.5 },
  { id: 72, name: "Leite de amêndoas", cal: 17, p: 0.6, c: 1.4, f: 1.1 },
  { id: 73, name: "Café (sem açúcar)", cal: 2, p: 0.3, c: 0, f: 0 },
  { id: 74, name: "Chá verde (sem açúcar)", cal: 1, p: 0, c: 0.2, f: 0 },

  // Outros
  { id: 75, name: "Mel", cal: 304, p: 0.3, c: 82, f: 0 },
  { id: 76, name: "Açúcar refinado", cal: 387, p: 0, c: 100, f: 0 },
  { id: 77, name: "Achocolatado em pó", cal: 379, p: 6, c: 80, f: 4 },
  { id: 78, name: "Chocolate amargo 70%", cal: 598, p: 8, c: 46, f: 43 },
  { id: 79, name: "Creme de leite", cal: 327, p: 2.5, c: 3.4, f: 35 },
  { id: 80, name: "Farinha de aveia", cal: 394, p: 14, c: 68, f: 7 },
]

export default foods