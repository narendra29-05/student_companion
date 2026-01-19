import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
    Container, Typography, Box, MenuItem, FormControl, 
    Select, InputLabel, Grid, Paper, List, ListItem, 
    ListItemText, Button, Divider, Avatar, Stack 
} from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const Materials = () => {
    const [selection, setSelection] = useState({
        regulation: 'R20',
        semester: '',
        subject: ''
    });

    const academicData = {
        R20: {
            "1-1": {
                "M1": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1WhGsJP9gQdfQT4EJoAeYZDyDPynFFnW-/view?usp=drivesdk" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1dmoYo4rXqNDABYpr0vui6_hbliiVPfzZ/view?usp=drivesdk" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1UPKuWXdd-q07bvUch2HxP0_5JQBiGAk/view?usp=drivesdk" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1HWHZtfS6Wh7vOa1njGBx-L4VVV3wlM1o/view?usp=drivesdk" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1nRPxxKeBHDTWxwUfEBoga8zrHbWok3xI/view?usp=drivesdk" }] },
                "Chemistry": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1D1F0DADfr__lUaYBie1dHTw6Z9awoKvi/view?usp=drivesdk" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1DUV0rTPLdB8id-OIy9bSGpXaP4VOf8ED/view?usp=drivesdk" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1xSRB-IDaAXhSz_cO3nchDy9REeM6_N32/view?usp=drivesdk" }, { name: "Unit 4", link: "https://drive.google.com/file/d/14u2qiHCxDI7rWZngfUuinPu6Dxd7Pxi6/view?usp=drivesdk" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1QdfNP3l63m7ZltdiEh7cKUg4dh-IyXNF/view?usp=drivesdk" }] },
                "C Programming": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1sm7oJnodSCVCTYMbxtGUHLWcNnBECtaS/view?usp=drivesdk" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1CuLEecgwYSm61xMv5ld9KrCYoTlJx8DA/view?usp=drivesdk" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1uEctY_U4DDE6uq1AQ9xKGhAGYdkRM1tR/view?usp=drivesdk" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1Y565GLXikiuVoh-JB-7kimJ55Ua5UnZK/view?usp=drivesdk" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1IofrHduhCSqPe_zEKG71ZYcUzwoh2ngO/view?usp=drivesdk" }] }
            },
            "1-2": {
                "M2": { syllabus: "https://drive.google.com/file/d/1J8kuYUlyPWIJ-zxPnzm_hGSjoG0f_Z4O/view?usp=drive_link", units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1kWh9PYeiNrzoIwVGB9vQ3ss7aPUCDftM/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1PAdQQAruyl0Hu7ZpgbzaFIUy56FfGYxP/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1h8BJ9W9b_5PHEfk1tYscumEH3jN1vx0c/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1-WhlyJQ1fqyGm28axu19gGvuaYVUeEH7/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1SNoUWz7wSTDG2b0iYtaeDl6N9KK4UxmV/view?usp=drive_link" }] },
                "Physics": { syllabus: "https://drive.google.com/file/d/1UqhgiRUX5U-AurvMrvAMMrO43ZirVFCZ/view?usp=drive_link", units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1WqexkquEjYK64iBwkDRM_Dy4OikvRzfa/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1HHKEc9I6zgomz4jpxluvKHyl1aQDMMu9/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/16aQQvRRGNhC64vQsZKmA_glq-kQwyJna/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1AxQf3NV-dOorJ-7x6CSfkQKAg-qONg3n/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1L2-Q19Db_G9329wD-zoYQ_fS4puNsGUR/view?usp=drive_link" }] },
                "DLD": { syllabus: "https://drive.google.com/file/d/1HAwBCTvd3l0HMfshiL64RQJXQ1nRNgT_/view?usp=drive_link", units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1u8SAy6jsX8SVJEpqJOxuS9UzLGuer7zu/view?usp=drivesdk" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1nYjNm38xh9qXZZhFoxIydrehR8hHHxtW/view?usp=drivesdk" }, { name: "Unit 3", link: "https://drive.google.com/file/d/11Zx9xed-f30omr6AC_NFV8ZoygwDGc8n/view?usp=drivesdk" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1FkcMG_BFwEB_vSGq_ByNLaA1MArvu9ey/view?usp=drivesdk" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1ikwXQbmPUsAi_h6AyaThtKj7TyBztU1n/view?usp=drivesdk" }] },
                "Python": { syllabus: "https://drive.google.com/file/d/1Tvw18NkgXcrB5j3uW2-ZMoewMk1xlODp/view?usp=drive_link", units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1f7JqWlyMxp3VEjS0Y_OD2Er9vAiDcIzC/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1yYJC3MUSvgBDM7rC1QxWP6VkzUT13sF7/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1nqjxq1tmoJ2UTo8ErkWOq0ygs_0if2gu/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1ArGGDSMuQmy9s1KnBxB1qB4gtQmFCOEG/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1_acQp9_NC06AJdJPp4BBsUYNaThrPw45/view?usp=drive_link" }] },
                "Data Structures": { syllabus: "https://drive.google.com/file/d/1tF0Jnak3wQ7JrjPg2w4J-CFfSXXJFiq5/view?usp=drive_link", units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1bIfgKNRh0Vs8Npp0cJPT75FtNw7BPdnQ/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1memR4zAet6uhfJeVvqZqdaicezy7rt0o/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1y5XQBQc9XoVqnijGX6tSKdCnBQZYkj_h/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1ipGwcW2xWvZ_ueOuD8HWxdqc9O3icW91/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1heorVEU4JcQ-akDOTsJmN2Yt1VKNpEff/view?usp=drive_link" }] }
            },
            "2-1": {
                "DBMS": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1ZlveO8RL7sb31adSG_GgSc5Nk3HAoN4m/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1GPMKOVWFKHBkKLYMzKgI-2dnm_jNIiWF/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1W651oIHruE0FGH41s1lWVYm7ZVen3uv-/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1SwAGX_dWaXamoXHKOR2pGGmHICU9_mzz/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1aFe7lkjg_dnjqgO9Wht3FpXHH9wfTYgr/view?usp=drive_link" }] },
                "AIML": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1tdvKsvSGNOnRqovBzct6nExz2eDIQzaT/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1FX1V335UJLBCV6YgkkPcZ7NFVgUX1r7z/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/174A8PuGnita4kMWWl-NnYbm03JvNbPiJ/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1CgvNFLqAvgtNP7qVKaYzMshUddHoSoTt/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1X1mK_AndS5TY-VNmv7WKj3Q3cgrITS-h/view?usp=sharing" }] },
                "OOPJ": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1ZqxoxZ4g61R2KQ3FQwRJ10yoICuDlExm/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/19ZuFrtuKgGfCZuJA-_rXUAsz_NtVh8QW/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1skoqRLR7-yjo-u67k6YnXPaYgJiaabRU/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/19cXNI27Mt1deJuXIxpBil75a1ww1_Kqh/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1OCOoYiplYocyT_yQ1BY4gylTsmGJjOwM/view?usp=sharing" }] },
                "Mathematics-3": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1seHJ-ErqblV1tKglNy6QSpF7FxISnbUx/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1TF96FCG6dhtzgndFPfwB6bc78zEpsd7R/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1cVZfLFxzHw2XOI7_Bxa30s__aydV4gAY/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1jjZ9jNHekXNpq2muBnO6HW7VWCjhP7Ia/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1o7exmRorJLXLoYpg2TlORbgwgX-Fabif/view?usp=sharing" }] },
                "MFCS": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1rPkq3hWuf0i6V7OK2BvwqSUvYY5c_aVG/view?usp=sharing" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1lW1eQWEFm0HT_x2-F3cx6mjIA-th2z6g/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1OTL6uqCRZtkEg_d3DH2dGTdc9_HPlk9I/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1sMNJuURQLvL_lpwF2M4vpzffpqB2QUl1/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1fpp05K0j_Bi5eKp0jc2R5CppB6--li-R/view?usp=sharing" }] }
            },
            "2-2": {
                "P&S": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1dqPe9YLWY2jqac82cX875QyJnCkI2tMy/view?usp=sharing" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1HJ9Y47g3H8snhpZW4qwjXRNKVQ1vVnaH/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1bSTwfBjjjTY1Yk-5qiwivxQIWGN8QYfW/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1WGOVPc7Nt8spY0CxbD05uZ578fXTKNFn/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1A0Ys2cgyi0FuRnsAaTpEnMRWHhzYxOjC/view?usp=sharing" }] },
                "DWDM": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1nO4CCgYiwyLLmvlqIAkXt0DUmqDn9aYM/view?usp=sharing" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1LvSe4VzSO4e9xOEoCpGTpiUv4l0vwp6o/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1Wp6fxgGkhAwPnfHAt_lz2PSh8PUTURxv/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1bfJnXZgSOpxu8UQOEzdBm2ceyt8mAbSi/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/15199M9Xf_j8Ju8ShOB7TfaJrrs6Jqfn0/view?usp=sharing" }] },
                "FLAT": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1OiOk-c60657jXkB_jSeeGY-exBpoY7XS/view?usp=sharing" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1ItLD_abfy0nV21WPrSZWHxLovqcQTq-t/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1ipu-Ec4wzXq9VuO_YncpKtyM4MOetjWT/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1ipu-Ec4wzXq9VuO_YncpKtyM4MOetjWT/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1CiJkwVX2R6HNaeS2mvxnnoDUN-0iRrsQ/view?usp=sharing" }] },
                "MEFA": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1IH2PsX0Y6r5eLmD2E0Xmxrb5P44JFOfY/view?usp=sharing" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1fPhUzE6o9nqNN_8Yc70PfaoHZTNqaNn0/view?usp=sharing" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1ZFws2-rp3YVnIDLD6C_ihMmhYqANpAAO/view?usp=sharing" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1my1eVXVxrgQutRluNjtOCg1XQDOGMba6/view?usp=sharing" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1mBeLGkkySnXM2yTLEp9fh-HtBQ8y9CJd/view?usp=sharing" }] },
                "CO": { units: [{ name: "All Units (1-5)", link: "https://drive.google.com/file/d/1QGGlz3fdEH9HHIktigrW9z97yf9Y6GHK/view?usp=sharing" }] }
            },
            "3-1": {
                "CD": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1_g9zAw4hKzGEusmt_H3hdvbiufHkeGYI/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1w5vjpePEbRxrBorMoJWMXoQxE_LQgoGh/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1exJ69wIJ1AtV1AgyxRtGPcvKzin7h2HG/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/10FXBZltZwYNURcKY8V6_WXXxGoLMT-Aj/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1Q35npVYmUXlLu0jKsrvFd4j2zuACcr84/view?usp=drive_link" }] },
                "ML": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1OXL-Usn-5KYMdf_HNZZA569sxq4jYQqf/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1yso6RtOkcZnSGKXpku3_dwS28pgzZY4M/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1mwc8U3FQ0ySKuXfWTxOrodfwIf5pSU6p/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1tAD_uyFyotS4DVahWYnPXcgzFu58lvO6/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1bWcxLmnotZv-Nhu3zN2IJPKBBJLGTcYd/view?usp=drive_link" }] },
                "OS": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1LDAizdAlgsoyEVnXqK6A9b1kr1u1MGzu/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1x-2g_nrTOxOEydfb8XuEQ3WSeHwntYZj/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1jZrSFCZy2BZDuDC2E17bZLPiZfsnyWjU/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1U8zs3l4b5haBhBRS3uTVT97YsNM8wDLa/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1gOcL-aQm1i4SXASmYNvYRyNZVIZwpNnQ/view?usp=drive_link" }] },
                "SE": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1a0OQExpaaROB7Beyh9ET6BQ4foZP5jxs/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1or_8C2jd6ftF7g-Z8EYmWi28PP4PPBrE/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1UVF51C5aca3bTo9uhVkUxDeAs3dJ0dM9/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1SxzlrcBM9CwKH0jKvZzZ4H47Sb5cAtoF/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1rca8_WWGhFXv08XgffdqysLA95MrTzds/view?usp=drive_link" }] },
                "DL": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1_TZp3_w7vpbC58dFJmCLE6amte9LF0dv/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1HWHZtfS6Wh7vOa1njGBx-L4VVV3wlM1o/view?usp=drivesdk" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1kOfdPCT33_Ya82-D-cSQ0hhdQOyu9ACy/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1hjEIRzRrouU_fbE67bO4b_vY12Fq0x3Y/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1VWfDZ4iPBxOMr24yoiU-ch8Y2IlOcLyi/view?usp=drive_link" }] }
            },
            "3-2": {
                "CN": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1Uzd0hM4Qhdfe_AzWTL0cKjMoAs4xTKnF/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1CvK7_q5_XJ8qn9Q9Iup12dwhhG_evaXS/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1MRcMdQRCr-Px3U2np9qqIjpmwdVVnefb/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1IoQYvQnGF29zWEPqD0Sw7mk5sAnowBm3/view?usp=drive_link" }] },
                "DAA": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/13I3mAdAQrWeD-zJBpeWJkVSJoX6NSn8A/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1l3g_UVNqJy650CLJJVHmVrT_XEUIAidJ/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/13uTkMAGDRriQ-D4I20V8Bg-LTxQd72R7/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1BkHwWt5b6J-3KE9qJUll6H8Lf4INCkbA/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1DAkFLmKgEy2YLBCBAAlhlhucmjUMGacK/view?usp=drive_link" }] },
                "Mean Stack": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1mOBajWLgPVzNq2tgyKhcTB3YCn2Ej3s5/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1NrMfLiF3msxR8RAlkqFIfshPGbI6kjR_/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1lg3zMxDEgTelDLPeUPMiQGLlj8HTc2KG/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1zUheGrmbZyo3dd3I9xVkq9axS7GOTxBY/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1gk-4kBv7d41np9uMyG7Ws7S_Ihz457_7/view?usp=drive_link" }] },
                "OOR": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1DFTinfGkJ1QZg9CTSi5rAqCo8o9v7j3L/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1lVlY0jKRtJRHoFqwP0xVRpaBsXGr2PkU/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1pCmazbtQY6lcHlf9uDjSQhjHi9TMZWMA/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1-MELb59vmG9wctm1gki8Dux5-AigcFwM/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1FD9Jrq0zdizOVk1LEsOrJJm63VSoO6g5/view?usp=drive_link" }] },
                "SPM": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/12kFb_Iyk_tNIKiXDFn5mqRcjt7g555Nq/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1HVraYNP9jn9ipPwYn8LZ0XLbAnuWWE06/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1CHLnifSN_cFz0ezzUMCADGG-05vAYIXw/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1RxyO5pVRY9h__HmYOKqZiIMw8Jp6uwu_/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1eMEOFV8r-QcybEZt_V8Z8ci9UiG92b51/view?usp=drive_link" }] }
            },
            "4-1": {
                "UHV": { units: [{ name: "Unit 1", link: "https://docs.google.com/document/d/1zIQVPf4xmQPCLjC0aklIygeMhOmrrkkI/edit?usp=drive_link" }, { name: "Unit 2", link: "https://docs.google.com/document/d/1tFZmkIPBJ9mvg2kKPXliVSMxtTyVcYWo/edit?usp=drive_link" }, { name: "Unit 3", link: "https://docs.google.com/document/d/1ih8EPRjl_2w3lcdHiUVCzLagoPdCI7Ta/edit?usp=drive_link" }, { name: "Unit 4", link: "https://docs.google.com/document/d/1zltgiWdacnKzhr9w0qBcebvF1JBRQr8u/edit?usp=drive_link" }, { name: "Unit 5", link: "https://docs.google.com/document/d/1FnhI_y50inbFr9NJdhZUE55oMh2w4F1p/edit?usp=drive_link" }] },
                "AICHATBOT": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1nvUAogFrCBEKBWDR2V8kKOtgkeVa1J_L/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1XHXpvBVjlkldNwBipqmdsR5MSyoe1D5N/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1zdaG1v711zL5KRVtn5FXPvlUeFXkLEse/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1ykDP8OvvKeKJ9uEjY9BTb4A7m11ZWOyO/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1MjCSQ6UWzpvztAveZtLQ1uK4CrK7n5zT/view?usp=drive_link" }] },
                "Cloud Computing": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1uQgGMfvLZB9GasQKFyfF6ni2nybj7_Px/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1djY1zUJEL1rVRDu8mgAIZD3T0QFoI634/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1pKk2w1QmwkEXikJxAjvcck2cAC5E3Wns/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1OCxo0JZQu5EAnsNUTvgxFVDkrZNsLsC4/view?usp=drive_link" }] },
                "Block Chain": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1FgZlZummWIHwIJDWTZCdbtn45tpQy_ho/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1NFCcg-6CKstfEMG3eObgOG9_NVs1U-Jw/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1RJcJDN7rX-B_Rg8NBZ_p49Xyo6Q4wyqO/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1WQXZB0LksodET48QIJ5aUJUg6KOE4jd-/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1jyBZbskm1DbnltEmYJ8tfBqtJZ_NCwqL/view?usp=drive_link" }] },
                "MP&MC": { units: [{ name: "Unit 1", link: "https://drive.google.com/file/d/1saKKF-BB9WlTuGITjVEEK8IkbF_nApkN/view?usp=drive_link" }, { name: "Unit 2", link: "https://drive.google.com/file/d/1S7u0sPqQcGGt0603r812oI06FmJLe4IO/view?usp=drive_link" }, { name: "Unit 3", link: "https://drive.google.com/file/d/1f-GCm8HzqjopqscCUocHIvV-80fDhw18/view?usp=drive_link" }, { name: "Unit 4", link: "https://drive.google.com/file/d/1SpFiprq0h8RoxC-nSEpK6L9_GGahAapT/view?usp=drive_link" }, { name: "Unit 5", link: "https://drive.google.com/file/d/1CWKD63q8t5quFYR7ND-0yQm1emcg0U0M/view?usp=drive_link" }] }
            }
        }
    };

    const handleUpdate = (field, value) => {
        setSelection(prev => ({ 
            ...prev, 
            [field]: value, 
            ...(field === 'regulation' && { semester: '', subject: '' }),
            ...(field === 'semester' && { subject: '' })
        }));
    };

    const currentSubjectData = (selection.regulation && selection.semester && selection.subject)
        ? academicData[selection.regulation][selection.semester][selection.subject] 
        : null;

    return (
        <Box sx={{ 
            backgroundColor: '#f8fafc', 
            minHeight: '100vh', 
            py: 8,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decoration */}
            <Box sx={{ 
                position: 'absolute', top: -100, right: -100, width: 400, height: 400, 
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)' 
            }} />

            <Container maxWidth="lg">
                {/* --- HEADER --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Avatar sx={{ 
                            bgcolor: '#6366f1', width: 80, height: 80, mx: 'auto', mb: 3,
                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
                        }}>
                            <LibraryBooksIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h2" sx={{ 
                            fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', mb: 1,
                            fontSize: { xs: '2.5rem', md: '3.75rem' }
                        }}>
                            Academic <span style={{ color: '#6366f1' }}>Repository</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
                            Curated high-quality resources for your engineering excellence
                        </Typography>
                    </Box>
                </motion.div>

                {/* --- FILTERS BENTO CARD --- */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
    <Paper elevation={0} sx={{ 
        p: { xs: 3, md: 5 }, mb: 6, borderRadius: '32px', border: '1px solid #e2e8f0',
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    }}>
        <Grid container spacing={4}>
            {/* Regulation Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled">
                    <InputLabel 
                        id="reg-label" 
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }} // Added margin top to label
                    >
                        Regulation
                    </InputLabel>
                    <Select 
                        labelId="reg-label"
                        value={selection.regulation} 
                        disableUnderline
                        onChange={(e) => handleUpdate('regulation', e.target.value)}
                        sx={{ 
                            borderRadius: '16px', 
                            background: '#f1f5f9', 
                            fontWeight: 700,
                            height: '70px', // Fixed height for consistency
                            '& .MuiSelect-select': { 
                                pt: 3, // Increased top padding to push text down from label
                                pb: 1,
                                fontSize: '1.1rem' 
                            } 
                        }}
                    >
                        <MenuItem value="R20">R20 Regulation</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Semester Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled" disabled={!selection.regulation}>
                    <InputLabel 
                        id="sem-label" 
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}
                    >
                        Semester
                    </InputLabel>
                    <Select 
                        labelId="sem-label"
                        value={selection.semester} 
                        disableUnderline
                        onChange={(e) => handleUpdate('semester', e.target.value)}
                        sx={{ 
                            borderRadius: '16px', 
                            background: '#f1f5f9', 
                            fontWeight: 700,
                            height: '70px',
                            minWidth: '220px', // Prevents shrinking
                            '& .MuiSelect-select': { 
                                pt: 3, 
                                pb: 1,
                                fontSize: '1.1rem' 
                            } 
                        }}
                    >
                        {Object.keys(academicData[selection.regulation] || {}).sort().map(sem => (
                            <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Subject Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled" disabled={!selection.semester}>
                    <InputLabel 
                        id="sub-label" 
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}
                    >
                        Subject
                    </InputLabel>
                    <Select 
                        labelId="sub-label"
                        value={selection.subject} 
                        disableUnderline
                        onChange={(e) => handleUpdate('subject', e.target.value)}
                        sx={{ 
                            borderRadius: '16px', 
                            background: '#f1f5f9', 
                            fontWeight: 700,
                            height: '70px',
                            minWidth: '220px',
                            '& .MuiSelect-select': { 
                                pt: 3, 
                                pb: 1,
                                fontSize: '1.1rem' 
                            } 
                        }}
                    >
                        {selection.semester && Object.keys(academicData[selection.regulation][selection.semester]).map(sub => (
                            <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </Paper>
</motion.div>

                {/* --- CONTENT SECTION --- */}
                <AnimatePresence mode="wait">
                    {currentSubjectData ? (
                        <motion.div 
                            key={selection.subject}
                            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={8}>
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <SchoolIcon sx={{ color: '#6366f1', fontSize: 32 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                                            {selection.subject} Modules
                                        </Typography>
                                    </Box>
                                    
                                    <Paper sx={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                                        <List sx={{ p: 0 }}>
                                            {currentSubjectData.units.map((unit, index) => (
                                                <motion.div key={index} variants={itemVariants}>
                                                    <ListItem sx={{ 
                                                        py: 4, px: 5, transition: '0.3s',
                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                                        gap: 2,
                                                        '&:hover': { background: '#f8fafc' }
                                                    }}>
                                                        <Box sx={{ 
                                                            bgcolor: '#fee2e2', p: 2, borderRadius: '16px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            <PictureAsPdfIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                                                        </Box>
                                                        <ListItemText 
                                                            primary={unit.name} 
                                                            primaryTypographyProps={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b' }}
                                                            secondary="Official Study Material • PDF"
                                                            secondaryTypographyProps={{ color: '#64748b', fontWeight: 500 }}
                                                        />
                                                        <Button 
                                                            href={unit.link} target="_blank" variant="contained" disableElevation
                                                            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
                                                            sx={{ 
                                                                borderRadius: '14px', px: 4, py: 1.5, textTransform: 'none',
                                                                fontWeight: 800, background: '#1e293b',
                                                                alignSelf: { xs: 'stretch', sm: 'center' },
                                                                '&:hover': { background: '#334155', transform: 'translateX(5px)' }
                                                            }}
                                                        >
                                                            Access
                                                        </Button>
                                                    </ListItem>
                                                    {index !== currentSubjectData.units.length - 1 && <Divider sx={{ mx: 5, opacity: 0.5 }} />}
                                                </motion.div>
                                            ))}
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Stack spacing={3}>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>Quick View</Typography>
                                        
                                        {currentSubjectData.syllabus && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Paper sx={{ 
                                                    p: 4, borderRadius: '32px', color: '#fff',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)'
                                                }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Subject Syllabus</Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, fontWeight: 500 }}>
                                                        Download the complete unit-wise breakdown and exam scheme.
                                                    </Typography>
                                                    <Button 
                                                        fullWidth variant="contained" href={currentSubjectData.syllabus} target="_blank"
                                                        sx={{ bgcolor: '#fff', color: '#4f46e5', fontWeight: 800, borderRadius: '14px', '&:hover': { bgcolor: '#f8fafc' } }}
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </Paper>
                                            </motion.div>
                                        )}
                                        
                                        <Paper sx={{ p: 4, borderRadius: '32px', border: '2px dashed #cbd5e1', bgcolor: '#f1f5f9' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#475569', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                💡 Learning Tip
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, lineHeight: 1.8 }}>
                                                Use these materials alongside your lecture notes for the best preparation. These drive links are updated per the latest R20 academic standards.
                                            </Typography>
                                        </Paper>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                                <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                    Select your Regulation, Semester, and Subject to view materials
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
};

export default Materials;