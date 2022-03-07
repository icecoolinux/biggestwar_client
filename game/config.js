
class Config
{
	static isMobile(){
		return true;
	}
}



///// MOVIMIENTO //////

Config.MOVIMIENTO_CAMARA_SEGUNDO = 140.0;


///// JUEGO //////

Config.INIT_POS_X = 0;
Config.INIT_POS_Y = 0;
Config.INIT_POS_Z = 0;
Config.ANCHO_PROJECTION = 200;
Config.NEAR_ORTHO = -1000;
Config.FAR_ORTHO = 1000;

Config.FONT_HEIGHT = 0.022;

Config.FPS = 40;

///// MAPA //////

// Metros cuadrados de todo el mapa.
Config.METROS_LADO_MAPA = 8000;
// Tamano en metros que ocupa cada cuadrado de mapa, minima resolucion del mapa.
Config.METROS_LADO_CUAD_MAPA = 5;
// El terreno se agrupa en clusters cuadrados de varios cuadrados.
// Se envia a dibujar esos clusters, para no dibujar todo el mapa
// ni tampoco dibujar cuadrados individuales.
Config.CUADS_POR_CLUSTER_MAPA = 40;
// Metros de lado que ocupa la textura del terreno.
Config.METROS_LADO_TEXTURA_TERRENO = 30;
// Textura del terreno.
Config.TEXTURE_TERRAIN = "terrain_arido";
// Sun.
Config.SUN_DIR = "1.0,1.0,1.0";
Config.AMBIENT_COLOR = "0.3, 0.3, 0.3";
Config.SUN_COLOR = "1.0,1.0,1.0";



///// UNITS AND BUILDINGS /////

Config.OT_MINERAL = 1;
Config.OT_BASE = 2;
Config.OT_BARRACA = 3;
Config.OT_TORRETA = 4;
Config.OT_RECOLECTOR = 5;
Config.OT_SOLDADO_RASO = 6;
Config.OT_SOLDADO_ENTRENADO = 7;
Config.OT_TANQUE = 8;
Config.OT_TANQUE_PESADO = 9;
Config.OT_ALL = 10;
Config.OT_NONE = 11;
	
	
Config.ALTURA_UI_MINERAL = 7.0;
Config.ALTURA_UI_BASE = 20.0;
Config.ALTURA_UI_BARRACA = 10.0;
Config.ALTURA_UI_TORRETA = 17.0;
Config.ALTURA_UI_RECOLECTOR = 5.0;
Config.ALTURA_UI_SOLDADORASO = 9.0;
Config.ALTURA_UI_SOLDADOENTRENADO = 13.0;
Config.ALTURA_UI_TANQUE = 6.0;
Config.ALTURA_UI_TANQUEPESADO = 8.0;

Config.RADIO_MINERAL = 4.0;
Config.RADIO_BASE = 15.0;
Config.RADIO_BARRACA = 12.0;
Config.RADIO_TORRETA = 5.0;
Config.RADIO_RECOLECTOR = 3.0;
Config.RADIO_SOLDADORASO = 3.0;
Config.RADIO_SOLDADOENTRENADO = 5.0;
Config.RADIO_TANQUE = 6.0;
Config.RADIO_TANQUEPESADO = 8.0;

Config.MAX_AMOUNT_RECOLLECT_RECOLECTOR = 20.0;
Config.VISIBILITY_DISTANCE = 60.0;
Config.VEL_RECOLECTOR = 20.0;
Config.VEL_SOLDADORASO = 20.0;
Config.VEL_SOLDADOENTRENADO = 20.0;
Config.VEL_TANQUE = 20.0;
Config.VEL_TANQUEPESADO = 20.0;

Config.FULL_LIFE_BASE = 500;
Config.FULL_LIFE_BARRACA = 300;
Config.FULL_LIFE_TORRETA = 100;
Config.FULL_LIFE_RECOLECTOR = 15;
Config.FULL_LIFE_SOLDADORASO = 25;
Config.FULL_LIFE_SOLDADOENTRENADO = 40;
Config.FULL_LIFE_TANQUE = 80;
Config.FULL_LIFE_TANQUEPESADO = 150;

Config.MINERALS_COST_BASE = 500;
Config.MINERALS_COST_BARRACA = 400;
Config.MINERALS_COST_TORRETA = 300;
Config.MINERALS_COST_RECOLECTOR = 70;
Config.MINERALS_COST_SOLDADO_RASO = 100;
Config.MINERALS_COST_SOLDADO_ENTRENADO = 200;
Config.MINERALS_COST_SOLDADO_TANQUE = 300;
Config.MINERALS_COST_SOLDADO_TANQUE_PESADO = 400;


///// UI //////
Config.DIST_DOUBLE_CLICK = 200;
Config.MINIMAP_RES_LOW = 256;
Config.MINIMAP_RES_HIGH = 512;

