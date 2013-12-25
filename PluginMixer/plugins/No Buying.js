// Hooks
game.hook("Dota_OnBuyItem", onBuyItem);

//NoBuying

/* HAPPENINGS */
function onBuyItem(unit, item, player, unknown)
{
	// Allow the purchase of TP Scrolls
	if (item == "item_tpscroll" || item == "item_relic" || item == "item_demon_edge")
		return;

	// Block all other item purchases
	return false;
}