III/92      A Library of Stellar Spectra (Jacoby+ 1984)
================================================================================
A Library of Stellar Spectra
    Jacoby G.H., Hunter D.A., Christian C.A.
   <Astrophys. J. Suppl. Ser., 56, 257 (1984)>
   =1984ApJS...56..257J
================================================================================
ADC_Keywords: Spectrophotometry

Description:
    The machine-readable version of the library contains digital spectra
    of 161 stars of spectral types O through M and luminosity classes I,
    III, and V. Most stars are of solar metallicity, although two were
    chosen specifically for low metallicity. The data were obtained with
    the Intensified Reticon Scanner on the #1 91-cm telescope at Kitt Peak
    National Observatory. The scans cover the wavelength range 3510-7427
    angstroms, with a resolution of approximately 4.5 angstroms, while the
    typical photometric uncertainty of each resolution element is about 1
    percent and broadband variations are < 3 percent.

File Summary:
--------------------------------------------------------------------------------
 FileName  Lrecl  Records  Explanations
--------------------------------------------------------------------------------
ReadMe        80        .  This file
stars.dat    100      161  Information on each star
fluxes.dat    80    64400  The Library of Stellar Spectra, flux data
--------------------------------------------------------------------------------

See also:
   III/83 : IUE Low-Dispersion Reference Atlas I, Normal Stars (Heck+ 1984)
   III/88 : Stellar Spectrophotometric Atlas (Gunn+ 1983)
  III/124 : Spectrophotometry of 60 stars (Kiehling, 1987)
  III/166 : A New Library of Optical Spectra (Silva+ 1992)
  III/196 : Near-IR stellar spectra from 1.428 to 2.5 um (Lancon+ 1996)
    VI/50 : Intensity Distribution of Normal Stars  (Sviderskiene, 1988)
  J/PASP/110/863 : A Stellar Spectral Flux Library 1150-25000{AA} (Pickles 1998)


Byte-by-byte Description of file: stars.dat
--------------------------------------------------------------------------------
   Bytes Format  Units   Label    Explanations
--------------------------------------------------------------------------------
       1  A1     ---   f_Name     [*] Name corrected from original version
   2- 11  A10    ---     Name    *Star identification (HD, BD, SAO, misc.)
  13- 16  A4     ---     SpT      Adopted spectral type.
  17- 19  A3     ---     Lum      Adopted luminosity class
  21- 22  A2     ---     Sp1      Spectral type from lit. if different
  24- 26  A3     ---     Lum1     Luminosity class from literature if different
  28- 31  F4.2   mag     E(B-V)  *Derived color excess E(B-V)
  33- 36  F4.2   mag     (U-B)s   U-B color synthesized from the spectrum.
  38- 41  F4.2   mag     (B-V)s   B-V color synthesized from the spectrum.
  43- 47  F5.2   mag     (U-B)0   Dereddened color derived from (U-B)s
  49- 52  F4.2   ---     (B-V)0   Dereddened color derived from (B-V)s
  54- 57  F4.2   mag     U-B      ? U-B color taken from the literature.
  59- 62  F4.2   mag     B-V      ? B-V color taken from the literature.
  64- 70  F7.2   0.1nm   lambda1  [3510] Wavelength of first pixel
  72- 75  F4.2   0.1nm   Dlambda  [1.40] Wavelength increment per pixel
  77- 78  I2     h       RAh     *Right Ascension J2000 (hours)
  80- 81  I2     min     RAm     *Right Ascension J2000 (minutes)
  83- 87  F5.2   s       RAs     *Right Ascension J2000 (seconds)
      90  A1     ---     DE-     *Declination J2000 (sign)
  91- 92  I2     deg     DEd     *Declination J2000 (degrees)
  94- 95  I2     arcmin  DEm     *Declination J2000 (minutes)
  97-100  F4.1   arcsec  DEs     *Declination J2000 (seconds)
--------------------------------------------------------------------------------
Note on E(B-V):
   Derived color excess, E(B-V), used to to deredden the spectrum.

Note on Name, n_Name, RAh, RAm, RAs, DE-, DEd, DEm, DEs:
   Four stars (# 47, 94, 124, 128) have an asterisk (*) in the first
   byte, corresponding to the difficulties to identify them; for more
   details, see the "History" section below.
--------------------------------------------------------------------------------


Byte-by-byte Description of file: fluxes.dat
--------------------------------------------------------------------------------
   Bytes   Format   Units    Label    Explanations
--------------------------------------------------------------------------------
   1- 10    A10     ---      Name     Star identification from headers.dat
  11- 80   7E10.3 cW/m2/nm   F(i)    *? Flux values F(i) in erg/cm^2^/s/{AA}
--------------------------------------------------------------------------------
Note on F(i):
   Flux values F(i) in erg/cm2/s/Angstrom at wavelengths:
     lambda(i) = lambda1 + (i-1+[7*(L-1)])*Dlambda
     where L is the number of the line for the star of interest. There are
     400 lines of fluxes for each star.  Hence, L is the line number in the
     file, modulo 400.

     In the final record for each star, the seventh flux on the record
     appears blank.
--------------------------------------------------------------------------------

History:
  * 24-May-1993 [CDS]
    The original data pertaining to each star were contained in a group
    of 352 data records. The first two (header) records contained general
    information about the star, such as identification, spectral type, UBV
    colors and reddening, intrinsic UBV colors, and wavelength
    information. Records 3-352 contained 2799 flux values in groups of
    eight fluxes per record. The original file can easily be rebuilt by
    splitting each record in 352 80-bytes records; this split is
    straightforward on Unix workstations with the "fold" command.

  * 23-Aug-1996 Julie Anne Watko [SSDOO/ADC]
    The previous version of this catalog contained all data for each star
    on a single record. To provide a more useful lrecl, the long records
    were folded into 70-byte records using the Unix fold command. J.A.
    Watko [ADC] used IDL to insert star identification into the first 10
    bytes of each record and to create a separate file of header data.

  * 06-Oct-1998 [CDS]
    Positions of the stars were added when possible --- four stars could
    not be recognized: #47 [TR A 14 (G4 V)], #94 [HD 249240 (G7 III)],
    #124 [SIV P 24  (B9 Ib)], #128 [42 LSI (A2 I)]

  * 17-Aug-2012 [CDS]
    Following private communications with G. Jacoby, 3 of the stars could
    be recovered (the old names are in the file "new=old.txt"):
    * #94  originally HD 249240, is HD 249420;
    * #124 originally LSIV P 24, is  LS I +60 87 (not certain)
    * #128 originally 42 LSI, is  LS I +57 42;

  * 12-May-2014 [CDS]
    The last unidentified star (TR A 14) was retrieved by B. Skiff [Lowell Obs.]
    as star A14 in Trumpler's list of stars in the Coma Berenices cluster
    (1938LicOB..18..167T), also BD+25 2502.
    
Acknowledgement:
    Documentation for the original version was written by Wayne H. Warren,
    Jr. [NSSDC/WDC-A-R&S] November 1984 (file "doc_ori.txt"). This ReadMe
    file is a revision of Dr. Warren's original document and an Intro
    document [CDS] 24-May-1993 to the current CDS standard.

References:
   Jacoby G.H., Hunter D.A. and Christian C.A. 1984, A Library of Stellar
     Spectra, Astrophys. J. Suppl. Ser. 56, 278. (1984ApJS...56..257J)
================================================================================
(End)       Julie Anne Watko [SSDOO/ADC], Francois Ochsenbein [CDS]  06-Oct-1998
