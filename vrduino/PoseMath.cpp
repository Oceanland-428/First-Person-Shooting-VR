#include "PoseMath.h"

/**
 * TODO: see header file for documentation
 */
void convertTicksTo2DPositions(uint32_t clockTicks[8], double pos2D[8])
{
  //use variable CLOCKS_PER_SECOND defined in PoseMath.h
  //for number of clock ticks a second
    double deltaT[8] = {0, 0, 0, 0, 0, 0, 0, 0};
  	for (int i = 0; i < 8; i++) {
  		deltaT[i] = (double)clockTicks[i] / (double)CLOCKS_PER_SECOND;
  	}
  	for (int i = 0; i < 4; i++) {
  		double alphaH = -deltaT[2 * i] * 60.0 * 360.0 + 90.0;
  		double alphaV = deltaT[2 * i + 1] * 60.0 * 360.0 - 90.0;
  		alphaH = alphaH * 3.14159265358979323846 / 180.0;
  		alphaV = alphaV * 3.14159265358979323846 / 180.0;
  		pos2D[2 * i] = tan(alphaH);
  		pos2D[2 * i + 1] = tan(alphaV);
  	}

}

/**
 * TODO: see header file for documentation
 */
void formA(double pos2D[8], double posRef[8], double Aout[8][8]) {
  for (int i = 0; i < 4; i++) {
  		Aout[2 * i][0] = posRef[2 * i];
  		Aout[2 * i][1] = posRef[2 * i + 1];
  		Aout[2 * i][2] = 1.0;
  		Aout[2 * i][3] = 0.0;
  		Aout[2 * i][4] = 0.0;
  		Aout[2 * i][5] = 0.0;
  		Aout[2 * i][6] = -posRef[2 * i] * pos2D[2 * i];
  		Aout[2 * i][7] = -posRef[2 * i + 1] * pos2D[2 * i];
  		Aout[2 * i + 1][0] = 0.0;
  		Aout[2 * i + 1][1] = 0.0;
  		Aout[2 * i + 1][2] = 0.0;
  		Aout[2 * i + 1][3] = posRef[2 * i];
  		Aout[2 * i + 1][4] = posRef[2 * i + 1];
  		Aout[2 * i + 1][5] = 1.0;
  		Aout[2 * i + 1][6] = -posRef[2 * i] * pos2D[2 * i + 1];
  		Aout[2 * i + 1][7] = -posRef[2 * i + 1] * pos2D[2 * i + 1];
  	}


}


/**
 * TODO: see header file for documentation
 */
bool solveForH(double A[8][8], double b[8], double hOut[8]) {
  //use Matrix Math library for matrix operations
  //example:
  //int inv = Matrix.Invert((double*)A, 8);
  //if inverse fails (Invert returns 0), return false
  int inv = Matrix.Invert((double*)A, 8);
	if (inv == 0) return false;
	Matrix.Multiply((double*)A, (double*)b, 8, 8, 1, (double*)hOut);
	return true;

}


/**
 * TODO: see header file for documentation
 */
void getRtFromH(double h[8], double ROut[3][3], double pos3DOut[3]) {
    double s = 2.0 / (sqrt(h[0] * h[0] + h[3] * h[3] + h[6] * h[6]) + sqrt(h[1] * h[1] + h[4] * h[4] + h[7] * h[7]));
  	pos3DOut[0] = s * h[2];
  	pos3DOut[1] = s * h[5];
  	pos3DOut[2] = -s;
  	ROut[0][0] = h[0] / sqrt(h[0] * h[0] + h[3] * h[3] + h[6] * h[6]);
  	ROut[1][0] = h[3] / sqrt(h[0] * h[0] + h[3] * h[3] + h[6] * h[6]);
  	ROut[2][0] = -h[6] / sqrt(h[0] * h[0] + h[3] * h[3] + h[6] * h[6]);
  	double rTelta1 = h[1] - ROut[0][0] * (ROut[0][0] * h[1] + ROut[1][0] * h[4] - ROut[2][0] * h[7]);
  	double rTelta2 = h[4] - ROut[1][0] * (ROut[0][0] * h[1] + ROut[1][0] * h[4] - ROut[2][0] * h[7]);
  	double rTelta3 = -h[7] - ROut[2][0] * (ROut[0][0] * h[1] + ROut[1][0] * h[4] - ROut[2][0] * h[7]);
  	double len = sqrt(rTelta1 * rTelta1 + rTelta2 * rTelta2 + rTelta3 * rTelta3);
  	ROut[0][1] = rTelta1 / len;
  	ROut[1][1] = rTelta2 / len;
  	ROut[2][1] = rTelta3 / len;
  	ROut[0][2] = ROut[1][0] * ROut[2][1] - ROut[2][0] * ROut[1][1];
  	ROut[1][2] = ROut[2][0] * ROut[0][0] - ROut[0][0] * ROut[2][1];
  	ROut[2][2] = ROut[0][0] * ROut[1][1] - ROut[1][0] * ROut[0][1];

}



/**
 * TODO: see header file for documentation
 */
Quaternion getQuaternionFromRotationMatrix(double R[3][3]) {

  double qw = 0.5*sqrt(1.0 + R[0][0] + R[1][1] + R[2][2]);
	double qx = (R[2][1] - R[1][2]) / (4 * qw);
	double qy = (R[0][2] - R[2][0]) / (4 * qw);
	double qz = (R[1][0] - R[0][1]) / (4 * qw);
	return Quaternion(qw, qx, qy, qz).normalize();

}
