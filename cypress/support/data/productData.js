/**
 * Products that already exist in the ServeRest environment.
 *
 * Tests that change one of these products must restore its original data afterwards.
 * Field names follow the ServeRest API contract.
 */
export const PRODUCTS = Object.freeze({
  bambuLabA1: Object.freeze({
    nome: "Bambu Lab A1",
    preco: 3000,
    descricao:
      "Bambu Lab A1 sem AMS Lite.\n\nLeia com atenção: a foto é meramente ilustrativa e esse anúncio é para venda somente da impressora, ou seja, não vem com os filamentos. Dentro da caixa da impressora tem somente uma pequena amostra de 20gr de filamento.",
    quantidade: 30,
    imagem: "C:\\fakepath\\bambu lab.webp",
  }),
});
