

class Geom
{
	constructor()
	{
		
	}
}


Geom.normalize = function(v)
{
	var norm = Geom.norm(v);
	v.x /= norm;
	v.y /= norm;
}

Geom.normalize3 = function(v)
{
	var norm = Geom.norm3(v);
	v.x /= norm;
	v.y /= norm;
	v.z /= norm;
}

Geom.norm = function(v)
{
	return Math.sqrt(Geom.prod(v, v));
}

Geom.norm3 = function(v)
{
	return Math.sqrt(Geom.prod3(v, v));
}

Geom.prod = function(v1, v2)
{
	return v1.x * v2.x + v1.y * v2.y;
}

Geom.prod3 = function(v1, v2)
{
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

Geom.dist = function(p1, p2)
{
	return Math.sqrt(Math.pow(p2.x-p1.x, 2)+Math.pow(p2.y-p1.y, 2));
}

Geom.dist3 = function(p1, p2)
{
	return Math.sqrt(Math.pow(p2.x-p1.x, 2)+Math.pow(p2.y-p1.y, 2)+Math.pow(p2.z-p1.z, 2));
}



Geom.intersectLineSphere = function(sphereCenter, radio, lineOrigin, lineDir)
{
	var dif = Object.assign({}, lineOrigin);
	dif.x -= sphereCenter.x;
	dif.y -= sphereCenter.y;
	dif.z -= sphereCenter.z;

	if((Math.pow(Geom.prod3(lineDir, dif), 2) - ( Math.pow(Geom.norm3(dif), 2) - radio*radio)) >= 0)
		return true;
	else
		return false;
}

// Return two points that intersect or null if there isn't intersection.
Geom.pointsLineSphere = function(sphereCenter, radio, lineOrigin, lineDir)
{
	// Move to origin.
	var lineOriginTmp = Object.assign({}, lineOrigin);
	lineOriginTmp.x -= sphereCenter.x;
	lineOriginTmp.y -= sphereCenter.y;
	lineOriginTmp.z -= sphereCenter.z;
	
	var a = (lineDir.x * lineDir.x) + (lineDir.y * lineDir.y) + (lineDir.z * lineDir.z);
	var b = (2 * lineOriginTmp.x * lineDir.x) + (2 * lineOriginTmp.y * lineDir.y) + (2 * lineOriginTmp.z * lineDir.z);
	var c = (lineOriginTmp.x * lineOriginTmp.x) + (lineOriginTmp.y * lineOriginTmp.y) + (lineOriginTmp.z * lineOriginTmp.z) - radio*radio;
	
	var raiz = b*b -4*a*c;
	if(raiz <= 0)
		return null;
	
	raiz = Math.sqrt(raiz);
	
	var l1 = (-b+raiz) / (2*a);
	var l2 = (-b-raiz) / (2*a);
	
	var p1 = Object.assign({}, lineOrigin);
	p1.x += lineDir.x * l1;
	p1.y += lineDir.y * l1;
	p1.z += lineDir.z * l1;
	
	var p2 = Object.assign({}, lineOrigin);
	p2.x += lineDir.x * l2;
	p2.y += lineDir.y * l2;
	p2.z += lineDir.z * l2;
	
	return [p1, p2];
}

// Distancia entre punto y plano.
Geom.planeDistance = function(pointPlane, dirPlane, point)
{
	var diff = { x: point.x - pointPlane.x,
				y: point.y - pointPlane.y,
				z: point.z - pointPlane.z };
		
	return Geom.prod3(diff, dirPlane);
}

Geom.sphereOutsidePlane = function(pointPlane, dirPlane, center, radio)
{
	var distCenter = Geom.planeDistance(pointPlane, dirPlane, center);
	return -distCenter > radio;
}


Geom.angleBetweenPoints = function(p1, p2)
{
	var angle = 0;
	var vectorTmp ={x: p1.x - p2.x, y: p1.y - p2.y};
	Geom.normalize(vectorTmp);
	if(vectorTmp.y > 0)
		angle = Math.acos(vectorTmp.x) * (180/Math.PI);
	else
		angle = 360 -Math.acos(vectorTmp.x) * (180/Math.PI);
	angle -= 90;
	
	if(angle >= 360)
		angle -= 360;
	if(angle <= -360)
		angle += 360;
	
	return angle;
}

Geom.setAngleSmooth = function(angle, target, delta)
{
	var reach = false;
	var diff = target - angle;
	if(Math.abs(diff) > 180)
	{
		if(diff < 0)
			diff += 360;
		else
			diff -= 360;
	}
	if(Math.abs(diff) <= delta )
	{
		angle += diff;
		reach = true;
	}
	else
	{
		if(diff < 0)
			angle -= delta;
		else
			angle += delta;
	}
	if(angle >= 360)
		angle -= 360;
	if(angle <= -360)
		angle += 360;
	
	return {angle:angle, reach:reach};
}














