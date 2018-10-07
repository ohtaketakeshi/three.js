
function CIE1931XYZ(){
  this.R;
  this.G;
  this.B;
  this.x;
  this.y;
  this.z;
  this.X;
  this.Y;
  this.Z;
}

CIE1931XYZ.prototype.xy2XYZ=function(Y){
  this.Y=Y;
  this.X=this.Y/this.y*this.x;
  this.Z=this.Y/this.y*(1-this.x-this.y);
}

// XYZにkを乗算
CIE1931XYZ.prototype.mul=function(k){
  this.X*=k;
  this.Y*=k;
  this.Z*=k;
}

CIE1931XYZ.prototype.getRGBs=function(){
  var rgb=this.R*256*256+this.G*256+this.B;
  return rgb.toString(16);
}

CIE1931XYZ.prototype.getRGBv=function(){
  var rgb=this.R*256*256+this.G*256+this.B;
  return rgb;
}

//XYZをsRGBに変換
CIE1931XYZ.prototype.XYZ2sRGB=function(r,g,b,flags){
  // 線形RGB D65
  var R,G,B;
  var RD,GD,BD;
  R=3.2410*this.X -1.5374*this.Y -0.4986*this.Z;
  G=-0.9692*this.X+1.8760*this.Y+0.0416*this.Z;
  B=0.0556*this.X-0.2040*this.Y+1.0570*this.Z;
  if(flags==0){
    if(R<0){
      this.R=r;
      this.G=g;
      this.B=b;
      return;
    }
    if(G<0){
      this.R=r;
      this.G=g;
      this.B=b;
      return;
    }
    if(B<0){
      this.R=r;
      this.G=g;
      this.B=b;
      return;
    }
  }
  if((flags%2)==1){
    if(R<0)
      R=0;
    if(G<0)
      G=0;
    if(B<0)
      B=0;
  }
  if(1<R){
    var S=R;
    R=1;
    B=B/S;
    G=G/S;
  }
  if(1<G){
    var S=G;
    R=R/S;
    B=B/S;
    G=1;
  }
  if(1<B){
    var S=B;
    R=R/S;
    B=1;
    G=G/S;
  }

  // γを考慮
  if(R<=0.0031308)
    RD=12.92*R;
  else
    RD=1.055*Math.pow(R,1/2.4)-0.055;
  if(G<=0.0031308)
    GD=12.92*G;
  else
    GD=1.055*Math.pow(G,1/2.4)-0.055;
  if(B<=0.0031308)
    BD=12.92*B;
  else
    BD=1.055*Math.pow(B,1/2.4)-0.055;
  RD=Math.round(RD*255);
  GD=Math.round(GD*255);
  BD=Math.round(BD*255);
  if(255<RD){ RD=255; }
  if(255<GD){ GD=255; }
  if(255<BD){ BD=255; }
  this.R=RD;
  this.G=GD;
  this.B=BD;
}

//sRGBからXYZ(D65)へ変換
CIE1931XYZ.prototype.sRGB2XYZ=function(){
  var r,g,b;
  // sRGBからリニアRGBへ変換
  r=this.R/255;
  g=this.G/255;
  b=this.B/255;
  if(r<=0.04045){
    r=r/12.92;
  }else{
    r=Math.pow( (r+0.055)/(1.055),2.4);
  }
  if(g<=0.04045){
    g=g/12.92;
  }else{
    g=Math.pow( (g+0.055)/(1.055),2.4);
  }
  if(b<=0.04045){
    b=b/12.92;
  }else{
    b=Math.pow( (b+0.055)/(1.055),2.4);
  }
  // D65
  this.X=0.4124*r+0.3576*g+0.1805*b;
  this.Y=0.2126*r+0.7152*g+0.0722*b;
  this.Z=0.0193*r+0.1192*g+0.9505*b;
  var S=this.X+this.Y+this.Z;
  this.x=this.X/S;
  this.y=this.Y/S;
  this.z=1-this.x-this.y;
}
