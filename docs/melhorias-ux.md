# Pixel Therapy — Melhorias de UX

Lista de melhorias para implementar uma de cada vez. Marque os checkboxes conforme for concluindo.

---

## 1. Botão "Verificar" como toggle

- [ ] Primeiro clique ativa a verificação visual (destaca células erradas)
- [ ] Segundo clique desativa a verificação (some o destaque)
- [ ] Se a verificação está ativa e o usuário pinta/apaga uma célula no grid, a verificação desativa automaticamente

---

## 2. Pintura "arrastando" o mouse

- [x] Enquanto o botão do mouse estiver pressionado sobre o grid editável, pintar todas as células sob o cursor com a cor selecionada (mousedown + mouseenter/mousemove)
- [x] Funcionar também via toque (touch) para mobile, se possível

---

## 3. Comentar a porcentagem de precisão

- [x] Manter apenas a mensagem textual (ex: "Muito bom!") e a verificação visual (destaque das células erradas)
- [x] Comentar/ocultar o número de % no `ResultPanel` (sem remover o cálculo, só a exibição)

---

## 4. Paleta de cores na vertical entre os grids (desktop)

- [x] No desktop, posicionar a `ColorPalette` na vertical, entre o grid de referência e o grid editável
- [x] No mobile, manter o layout atual (paleta abaixo dos grids)

---

## 5. Clicar em célula pintada apaga (remove a borracha)

- [x] Clicar em uma célula já pintada com a cor selecionada (ou qualquer cor) limpa a célula (volta para 0)
- [x] Comentar/remover o botão de borracha do `ColorPalette` (deixar comentado, não apagar o código)

---

## 6. Animação de pulso nas células erradas

- [x] Células marcadas como erradas (outline vermelho) pulsam lentamente (ex: `animation` de opacity/scale em loop)

---

## 7. Não repetir a paleta da obra anterior

- [ ] `pickRandomPalette()` não pode sortear a mesma paleta usada na geração anterior
- [ ] Guardar referência da última paleta usada (ex: índice) e excluí-la do sorteio seguinte

---

## 8. Botão de undo (desfazer)

- [ ] Botão com ícone de seta curva para trás, equivalente a Ctrl+Z
- [ ] Desfaz a última ação de pintura/apagamento no grid editável
- [ ] Histórico é resetado ao clicar em "Limpar" ou "Novo padrão"

**Sugestão (a validar):** guardar uma pilha com os últimos **20 estados** do `userGrid`. Como o grid é pequeno (16x16 = 256 valores de 0-4), o custo de memória de guardar várias cópias é irrelevante — 20 já cobre bastante exploração sem crescer demais. Se quiser histórico "ilimitado" durante a sessão também é tranquilo, mas 20 parece um bom equilíbrio entre utilidade e simplicidade.
