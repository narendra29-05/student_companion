/**
 * Seed script: Insert all study materials into the database.
 * Run with: node seedMaterials.js
 */
const { sequelize } = require('./config/db');
const { Material, MaterialUnit } = require('./models/Material');

const materials = [
    // ===================== R23 1-1 =====================
    {
        regulation: 'R23', semester: '1-1', subject: 'BEEE', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1_9PV_A_bRGK-G8OzY-fDADd6aprqA9cy/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/16GIn5t1HIT3RHf7CeA9SZJa6CObdWjA3/view?usp=drivesdk' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1zAG7Zz5zk17qLB48ilxZGNyCSTZJMx5q/view?usp=drivesdk' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1or_8C2jd6ftF7g-Z8EYmWi28PP4PPBrE/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1aCekVV0O6Kg515M_jx1ZRSBMtjTf0gzt/view?usp=drivesdk' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1MFmHVz9uTnSDxt4VrWBCdpN7HQycu8m2/view?usp=drivesdk' },
        ],
    },
    {
        regulation: 'R23', semester: '1-1', subject: 'Physics', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1MoASvAyq2e3XxCslFTYfDy5L9Z6M0CIh/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1HXuTeiGj3d13fjImaGPYdnChF3R0ouKz/view?usp=drivesdk' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1fFM0qhZ7AbE5gmTfP2z8-VW_gENr_qCs/view?usp=drivesdk' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1jL-ex2CkicZp9_OK-b6EVGgnpqgrsqgm/view?usp=drivesdk' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1nEoWwVh_GDx25pjcix0nSk5DPvkZViM2/view?usp=drivesdk' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1tiAzxpxcyZticApiwextX3TSR7X3jRWa/view?usp=drivesdk' },
        ],
    },
    {
        regulation: 'R23', semester: '1-1', subject: 'Linear Algebra and Calculus', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1FO3gcxGpl3r2Lr6aRUnTjv9pQE1Efker/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1nfy8uDHwLD8fNyg3O-t39xUUICuNYuKv/view?usp=drivesdk' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1o2iC7XfRDGtWCyHAkCSgTzc5vmBrwYxy/view?usp=drivesdk' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1lsYiChnqr7FlKCLQNjnkUM9zeUjRaD93/view?usp=drivesdk' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1OGaDXxgYbBLbmL6k_-NxFJHJYtxPeScs/view?usp=drivesdk' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/16m9tPGxOTFqhR7OLR-Sryc7hLupgdzvd/view?usp=drivesdk' },
        ],
    },
    {
        regulation: 'R23', semester: '1-1', subject: 'Engineering Graphics', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1h62EVYwxiPmQq3INMAqGuTVdvWs7DesY/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1OCxo0JZQu5EAnsNUTvgxFVDkrZNsLsC4/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1MRcMdQRCr-Px3U2np9qqIjpmwdVVnefb/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1w2gkTeSEn7a20xZEH88GXr9QjJvog0qk/view?usp=drivesdk' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/14UZgf3uCpA0UcLPA3ETmezIEJqviNNM4/view?usp=drivesdk' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1ApODBkjuAw_DUvhyxjD5cj-fkRplWDS2/view?usp=drivesdk' },
        ],
    },
    {
        regulation: 'R23', semester: '1-1', subject: 'Introduction to Programming', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1B-_wSOJdUSRHQtFICK21321aaS7IPDQZ/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1CbI99-0VrmF9ZULCx9-rBT5v6nsfdWmb/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1om5EKbVFSYRTqDzi3jfih0CgxMUxYXfM/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1lEZLdFw17fKD1-jZxRCejC-qRwUSj2tP/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1TphOSueiYbfGfADNvTdmwp-5Vb2iETCp/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1a6K2WLHQYUesjcOH-ZOuTTWwUymoGird/view?usp=drive_link' },
        ],
    },

    // ===================== R23 1-2 =====================
    {
        regulation: 'R23', semester: '1-2', subject: 'English', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1BL8Zm6tcUv-cHnu5Z9UMtvJPbiBDD_Yw/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/116UKj-wwSxRSow8UeuFbhbzewP3Po9t_/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1pbhepjXE1HV3ZyDrkkl291RnMrZ-aefn/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1MjCSQ6UWzpvztAveZtLQ1uK4CrK7n5zT/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1iDgCL-CBXnRhTBcJHxMyurWFKZK62UmW/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/15UxpKghxoVUxx_N_3_3R56n4YKNMlu_T/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '1-2', subject: 'Chemistry', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1b1nlRV6K7D4q1Mwtcy6s_m0i9_aHVJ2k/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1lvX89g2YQeKlZ2bxNZ7NdnbgKmYdRn2O/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1J52f60eA5tHR_Z7Lc_1Pm5kAqbnEXUYP/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/11BbXBjxkSZhwcSjjIOsi1s8JwFF-eRuT/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1kERdGrQ-77-FhbdBTCP7KGqGA6auULg6/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/17ws8mPDlrXjf4ekj7-ouu4AuhTQYqOLG/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '1-2', subject: 'Data Structures', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1aKcUfX9ciumjX2keobE9hTLrZ1Jcy1kp/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/13xq6mclE18HcMQkTRv5GfFF7pDFvDU1E/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1RRRK0kHQJQgK2UBzE5oZ5vKIQRSMa2HY/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1IJJvvYOCBesX_F8_yZ6pY36PqZ0By9j6/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1jZbV7kY05vO2yohGxoU4Ay9TJtMhmqpa/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1lEOnIDJ1JmNzCoc-huUBpHT9LCHOtegn/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '1-2', subject: 'DE & VC', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/1Dk-EcOPZrFNZQfXPK8Q2wnrGMixbGEMe/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/19UE5g-7Ytb2F8IdE_-uvy8AzKklYh6Cd/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/196JTktA96fk3tdo3DN1sELdK-cMhfnPa/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/10GUA2ET43U_kr3FwPWgbYaA5f1kliv_8/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1vO2LI6SaqPguca5aVhHRkDGVJZH797an/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1g6zJkLpKjr4aqDCGljKBhnXsC0kQY5Y1/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '1-2', subject: 'BCME', department: 'AIML', year: 1,
        syllabusLink: 'https://drive.google.com/file/d/115Q0OH-YRGtgCvOWohdBvdAI9h22zxVe/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1TR8cXjLexSle0Lnw9QjIV60XgM5Ohua8/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1QrT97U4oYrf_Q2CE1B899aIC8GXy6N7x/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1YZNOYKlZwOUOTR-zRUWTBvVBKJlCDt2N/view?usp=drive_link' },
        ],
    },

    // ===================== R23 2-1 =====================
    {
        regulation: 'R23', semester: '2-1', subject: 'AI', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1k4qiQTjTqPXcdmULhUt3SPh1NWYCeHFf/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1qyGKpEacSVl9oxvBBTufz8UWCXD-TjM4/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1jSNvaz5RDVXKZl965EndB3Autznt5OGp/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1XurNoHl13toO-blYOFtCZgT9Ugnu-wO7/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1gwuH6xuFdnQRK-VZmJgpgl2O1Dq7OPOB/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/177uKz25mGREBJrxoWlHDK_T9LmNc8Bmz/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-1', subject: 'ADS', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1mP2gC67A-FkrMvS_smbJpjggGPDa8vd5/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1ZCtNFGjgNahthv_XO0VsOrPmex6zYceD/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1qXWZ1byviWNrjcBPyZy8Qhr-doPFJhuv/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1WvQcl1mG0mkwPZlbOM0got-XQbrIBbZx/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1sx9UXqg90uzDBvGfzseUO3L2RFNXrXWL/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1Ft12WDbbCVBM4xKfpf5mr_CkoyFFbHH3/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-1', subject: 'DM & GT', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1R49gqU8I6LicmbQL06FMzMrzRRMJuRND/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/18K-KrqUMrLbdbtMgOuQOq8NCXgd3UiFH/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1KRVG602BgbNeaPdkCKil6B_g6DkULKN9/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1yVw1-Ey0yu3beFqzGZeEw7W2RD_SYbRe/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1-ia40eVLWnIDG6qaFPw4XLU1Ym3R-n47/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1MdEHhKgELMZeBbjLlmrwXsMEa2254Qfd/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-1', subject: 'Java', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1AqnWPSxrgCihChX9ljtN7fENJMoh-ukO/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1-qZpkS2hebLLQF0_dUga1PusW0QiL3Fq/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1m4-aSPPH7wNxGwDTDkyX-KKmvwXYZt9_/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1myYQZSs34eiTxJp49oulJ7IdA2ERoCkx/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1GkuAivSta7kgG_3Y-1gWWKnBxH0Ud3nf/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1qGNk4x_XiSkbPKfaXOiHm752wdsUuT1r/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-1', subject: 'UHV', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1HOsfsHIohxsVjXNQMn-S-gIcAGsCDHux/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1eCqrtPJD-Z5omzzPPUeHkkSoHL9M-2Gm/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1h4qm0Du-ZAekD4I2ixQpcGcybKu4iacd/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1t4JujnQW3wZfyNdZVoXgfUsDcinY1vvs/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1hIt_Y1HtE7jM_e0-Oy4-EjHMW8Rce2-8/view?usp=drive_link' },
        ],
    },

    // ===================== R23 2-2 =====================
    {
        regulation: 'R23', semester: '2-2', subject: 'P&S', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1FDQ_BYKxeoMJbWGvDlyNKlrXokvPM4xn/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1KtdkqAK4CjgzJ1hAD9TJgaGFlMsFPIlw/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1NixL6UUwKlvV_wILZfe3LxcxSiPZeagF/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1PFI6BV0VSPDQT4pILr8-GvuovaF16JwD/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1jVWZoUsJfUmsirlFmBu9JQilL6ORBCzW/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1_JIrJ2LU6BpJRM2k-Lc6SYeg64fFCAcM/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-2', subject: 'OT', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1amD9YSFoP5We_rAa5EXuL0lp2K3FquoA/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1_UIh4GnzquTiRqXmQK9Y2ZVo3OFsyFi8/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1iSk77lO4d_PZ1yxRaihZCA_9pPmhYbd7/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1cegjlm0y7aY6uump4Q6FU4lF51N087ps/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1cegjlm0y7aY6uump4Q6FU4lF51N087ps/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1cegjlm0y7aY6uump4Q6FU4lF51N087ps/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-2', subject: 'ML', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1y8XUy6WBIGECPTXfF4XkVeaJfLpe0Jb3/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/12MkBY5snGlL-h1jgnLepiJ0APo-u3p3m/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1EaXymAAbC1uZtaLsy3JLSHpyVrbE2WcT/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1JAfbUJVKHrNoNI_zvJvk_BBW3looRqhD/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1EeIoP2fdxcR-oJj--MJHgF_QTvsN-MYE/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1sqmAMLo3kcfIyHkWEGhwLdDa5sNqdq1-/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R23', semester: '2-2', subject: 'DL&CO', department: 'AIML', year: 2,
        syllabusLink: 'https://drive.google.com/file/d/1TaiwPrZkCeYfqmR6zN_Itv-P5qeWnj-h/view?usp=drive_link',
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1Du9UK_oz6hWaqLUIPdBSMQY0xo_ELcjj/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1UfmcRW9_VNuq2ZXCuoU94qW1j2c8y00t/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1bdR5fOm4hJowVqx2XePD_F0BB1jG_XFh/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1gDKA5Fw-xxOneKbzcUXnj3VDgmqhtydk/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1i7fsmxV8M_TZA7qVJfLQMxAN7100sa3O/view?usp=drive_link' },
        ],
    },

    // ===================== R23 3-1 =====================
    {
        regulation: 'R23', semester: '3-1', subject: 'Automata Theory and Compiler Design', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1TXFZsutxvQjM1511Lt-S2pHqEyxxbwmp/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1-GjHBhOMM57KOg_dCcAr7T10WRbJurC3/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1HzZzkh8ZumDmoAv-99HWiybuGAwMm9bS/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1AYTM8FojfmZuzhj-ueYH7biMXOoGfY8G/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1TMQw4QStJeu1Rje5FW3yR0N3NiG3COD8/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'Computer Networks', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1DM5lONOI0awSMrjUlCfhwSIw-_jq_6RQ/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1ef73d5iqiIY2ei5TDcq7eMaIOx4hw6qe/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1P1BCfW2t2VyUfKNDythCEYpJ-uePdnGr/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1nCHVUsgagBD5Li8GCO2p9Ui4PinR9cw2/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1O6Omr-WrRrMCMufrvVZhztJbIHS2XvRz/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'NLP', department: 'AIML', year: 3,
        units: [
            { name: 'Units 1-5', link: 'https://drive.google.com/file/d/18ulVNdgjQRD_yAuC-_SuDcbDyJ6ycx0Z/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'Deep Learning', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1JGoj8I3fkJ4EoHEOp8qDmxRDQN4vMqTC/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1JGoj8I3fkJ4EoHEOp8qDmxRDQN4vMqTC/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1lJPFaKUidfHzqZuWZ3mWJOKV7-ejUjwR/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1ck6vNkN44-QUBFHzKLepyj__sn-AhDsw/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1dI5RtgqA4oYkZ85aa2QJcWCHxuhyz73a/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'OS', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1lrxqvNl7ajV1-VoF1DxRekC1Qac4rTwH/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1a8EsFJoSJX2gytbgaZ1NntUqXjeRxYyO/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1Rzx2ICiHkRSIhZeOqC5hDQSKxxRm-hZ9/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/10uyaxCFqPNnMATj--0lCiywuKxPtCBUs/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1YyWC66Gza240zgKJ7panL2hx4MfZDGFC/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'OOAD', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/194Q2iztBUA2IMOCLfvJp42lIRX7ihSbj/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1JdlqNj_k_XCnVF2pR87-mBCGE0SybLxs/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1QYSeIDLN3YiTkvdXFSaBksn0uh1uGjSp/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1pufZIGACWF7zhtxvkIfUwbP0v9jScOrU/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1IS8j3qaLing2D3iertuBwL7CPmVsYbG8/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-1', subject: 'IOT', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1MhrwMlX7z4SrD5phJS2W8HzMIFx8zo9h/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1tMP57MtKQgKfo7RaQ4jlwtViHfCvUzl-/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/12MPlppNQ_tJWObDLF5QR38oVIRejDFkf/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/16LVQm49QjSSiUJvKNGNbHBhfVxuF6fgk/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1BNjaPjVGGne4J9Hmyqxz7YbDRh2bsMEH/view?usp=sharing' },
        ],
    },

    // ===================== R23 3-2 =====================
    {
        regulation: 'R23', semester: '3-2', subject: 'DevOps', department: 'AIML', year: 3,
        units: [
            { name: 'Units 1-5', link: 'https://drive.google.com/file/d/1lD6yCGlw1ubQcJdc9st9_v6uuiXw8CmA/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-2', subject: 'Cloud Computing', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1_61Pn8ZHqLpmD2EwhPf7Eb4dlVqtMalw/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1Pl8s3VUY7AJ6U4OBbolnjqzrDplGl2x2/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/119sFg7lxWB6YbqQigo6KrtygdvOf1Wmp/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1q73AjeIcPzcdPgK-kVkQoOWpsRtPBTjY/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1i3Qi8qs0iZynBA2Yek-vSkhsIQPu7Mfl/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-2', subject: 'Software Engineering', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/127gIPO5Fy3czeU24LK7OWXZbJ3BXRngr/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1J-d4MXpPMMar0TCnKchSZpeiw4mk0pB2/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1wHAkxD8reWZQKY_v87CtVUa7QY1_C4sA/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1nI55z8DoOiGBwIidt4l8oMzx3eAKX1CC/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1Yf3kfzi-o6h0DFHygt0N21_53ND8YFGT/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-2', subject: 'CNS', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1UrR1N43_zGdhjFY6XWLQ4Wsvbh2wlI0Q/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1LEgxRW_W55l97_1T6S3-J8RhitkEsfMa/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1vxh_L4YNdyw_EM5XtLxO-kgKfs9nucXC/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1P_trI6ArhVt-wdQb87GtpVBC0E22x2ke/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1ORmZ289L6JTL3uSkXm0J760u95f6xFYY/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R23', semester: '3-2', subject: 'Big Data Analytics', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1dWA2qH2jaKFkDLcvy50tjyzqm2szOQNk/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1MZY4gRNv4Sy0_1T9ixeCxXYWw8o6TLao/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1QKpUvS9Bt59q2S5McYjHRTic0qqNa-Uf/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1kM0JCjfphG84qExYj9RmJB6mQngtDQil/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1uHIkGl_gJBm_DKagHD0Pc8tuO7aEaSPt/view?usp=sharing' },
        ],
    },

    // ===================== R20 2-1 =====================
    {
        regulation: 'R20', semester: '2-1', subject: 'DBMS', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1ZlveO8RL7sb31adSG_GgSc5Nk3HAoN4m/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1GPMKOVWFKHBkKLYMzKgI-2dnm_jNIiWF/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1W651oIHruE0FGH41s1lWVYm7ZVen3uv-/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1SwAGX_dWaXamoXHKOR2pGGmHICU9_mzz/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1aFe7lkjg_dnjqgO9Wht3FpXHH9wfTYgr/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '2-1', subject: 'AIML', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1tdvKsvSGNOnRqovBzct6nExz2eDIQzaT/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1FX1V335UJLBCV6YgkkPcZ7NFVgUX1r7z/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/174A8PuGnita4kMWWl-NnYbm03JvNbPiJ/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1CgvNFLqAvgtNP7qVKaYzMshUddHoSoTt/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1X1mK_AndS5TY-VNmv7WKj3Q3cgrITS-h/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-1', subject: 'OOPJ', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1ZqxoxZ4g61R2KQ3FQwRJ10yoICuDlExm/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/19ZuFrtuKgGfCZuJA-_rXUAsz_NtVh8QW/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1skoqRLR7-yjo-u67k6YnXPaYgJiaabRU/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/19cXNI27Mt1deJuXIxpBil75a1ww1_Kqh/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1OCOoYiplYocyT_yQ1BY4gylTsmGJjOwM/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-1', subject: 'Mathematics-3', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1seHJ-ErqblV1tKglNy6QSpF7FxISnbUx/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1TF96FCG6dhtzgndFPfwB6bc78zEpsd7R/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1cVZfLFxzHw2XOI7_Bxa30s__aydV4gAY/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1jjZ9jNHekXNpq2muBnO6HW7VWCjhP7Ia/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1o7exmRorJLXLoYpg2TlORbgwgX-Fabif/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-1', subject: 'MFCS', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1rPkq3hWuf0i6V7OK2BvwqSUvYY5c_aVG/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1lW1eQWEFm0HT_x2-F3cx6mjIA-th2z6g/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1OTL6uqCRZtkEg_d3DH2dGTdc9_HPlk9I/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1sMNJuURQLvL_lpwF2M4vpzffpqB2QUl1/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1fpp05K0j_Bi5eKp0jc2R5CppB6--li-R/view?usp=sharing' },
        ],
    },

    // ===================== R20 2-2 =====================
    {
        regulation: 'R20', semester: '2-2', subject: 'P&S', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1dqPe9YLWY2jqac82cX875QyJnCkI2tMy/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1HJ9Y47g3H8snhpZW4qwjXRNKVQ1vVnaH/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1bSTwfBjjjTY1Yk-5qiwivxQIWGN8QYfW/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1WGOVPc7Nt8spY0CxbD05uZ578fXTKNFn/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1A0Ys2cgyi0FuRnsAaTpEnMRWHhzYxOjC/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-2', subject: 'DWDM', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1nO4CCgYiwyLLmvlqIAkXt0DUmqDn9aYM/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1LvSe4VzSO4e9xOEoCpGTpiUv4l0vwp6o/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1Wp6fxgGkhAwPnfHAt_lz2PSh8PUTURxv/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1bfJnXZgSOpxu8UQOEzdBm2ceyt8mAbSi/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/15199M9Xf_j8Ju8ShOB7TfaJrrs6Jqfn0/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-2', subject: 'FLAT', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1OiOk-c60657jXkB_jSeeGY-exBpoY7XS/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1ItLD_abfy0nV21WPrSZWHxLovqcQTq-t/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1ipu-Ec4wzXq9VuO_YncpKtyM4MOetjWT/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1ipu-Ec4wzXq9VuO_YncpKtyM4MOetjWT/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1CiJkwVX2R6HNaeS2mvxnnoDUN-0iRrsQ/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-2', subject: 'MEFA', department: 'AIML', year: 2,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1IH2PsX0Y6r5eLmD2E0Xmxrb5P44JFOfY/view?usp=sharing' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1fPhUzE6o9nqNN_8Yc70PfaoHZTNqaNn0/view?usp=sharing' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1ZFws2-rp3YVnIDLD6C_ihMmhYqANpAAO/view?usp=sharing' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1my1eVXVxrgQutRluNjtOCg1XQDOGMba6/view?usp=sharing' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1mBeLGkkySnXM2yTLEp9fh-HtBQ8y9CJd/view?usp=sharing' },
        ],
    },
    {
        regulation: 'R20', semester: '2-2', subject: 'CO', department: 'AIML', year: 2,
        units: [
            { name: 'Units 1-5', link: 'https://drive.google.com/file/d/1QGGlz3fdEH9HHIktigrW9z97yf9Y6GHK/view?usp=sharing' },
        ],
    },

    // ===================== R20 3-2 =====================
    {
        regulation: 'R20', semester: '3-2', subject: 'OOR', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1DFTinfGkJ1QZg9CTSi5rAqCo8o9v7j3L/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1lVlY0jKRtJRHoFqwP0xVRpaBsXGr2PkU/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1pCmazbtQY6lcHlf9uDjSQhjHi9TMZWMA/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1-MELb59vmG9wctm1gki8Dux5-AigcFwM/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1FD9Jrq0zdizOVk1LEsOrJJm63VSoO6g5/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '3-2', subject: 'SPM', department: 'AIML', year: 3,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/12kFb_Iyk_tNIKiXDFn5mqRcjt7g555Nq/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1HVraYNP9jn9ipPwYn8LZ0XLbAnuWWE06/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1CHLnifSN_cFz0ezzUMCADGG-05vAYIXw/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1RxyO5pVRY9h__HmYOKqZiIMw8Jp6uwu_/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1eMEOFV8r-QcybEZt_V8Z8ci9UiG92b51/view?usp=drive_link' },
        ],
    },

    // ===================== R20 4-1 =====================
    {
        regulation: 'R20', semester: '4-1', subject: 'UHV', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://docs.google.com/document/d/1zIQVPf4xmQPCLjC0aklIygeMhOmrrkkI/edit?usp=drive_link&ouid=104125856338550722444&rtpof=true&sd=true' },
            { name: 'Unit 2', link: 'https://docs.google.com/document/d/1tFZmkIPBJ9mvg2kKPXliVSMxtTyVcYWo/edit?usp=drive_link&ouid=104125856338550722444&rtpof=true&sd=true' },
            { name: 'Unit 3', link: 'https://docs.google.com/document/d/1ih8EPRjl_2w3lcdHiUVCzLagoPdCI7Ta/edit?usp=drive_link&ouid=104125856338550722444&rtpof=true&sd=true' },
            { name: 'Unit 4', link: 'https://docs.google.com/document/d/1zltgiWdacnKzhr9w0qBcebvF1JBRQr8u/edit?usp=drive_link&ouid=104125856338550722444&rtpof=true&sd=true' },
            { name: 'Unit 5', link: 'https://docs.google.com/document/d/1FnhI_y50inbFr9NJdhZUE55oMh2w4F1p/edit?usp=drive_link&ouid=104125856338550722444&rtpof=true&sd=true' },
        ],
    },
    {
        regulation: 'R20', semester: '4-1', subject: 'AI Chatbot', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1nvUAogFrCBEKBWDR2V8kKOtgkeVa1J_L/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1XHXpvBVjlkldNwBipqmdsR5MSyoe1D5N/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1zdaG1v711zL5KRVtn5FXPvlUeFXkLEse/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1ykDP8OvvKeKJ9uEjY9BTb4A7m11ZWOyO/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1MjCSQ6UWzpvztAveZtLQ1uK4CrK7n5zT/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '4-1', subject: 'Cloud Computing', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1uQgGMfvLZB9GasQKFyfF6ni2nybj7_Px/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1djY1zUJEL1rVRDu8mgAIZD3T0QFoI634/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1pKk2w1QmwkEXikJxAjvcck2cAC5E3Wns/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1OCxo0JZQu5EAnsNUTvgxFVDkrZNsLsC4/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1wdcTi3ZuE8uNDgLhEiIdu38kuGYfNZML/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '4-1', subject: 'Blockchain Technologies', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1FgZlZummWIHwIJDWTZCdbtn45tpQy_ho/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1NFCcg-6CKstfEMG3eObgOG9_NVs1U-Jw/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1RJcJDN7rX-B_Rg8NBZ_p49Xyo6Q4wyqO/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1WQXZB0LksodET48QIJ5aUJUg6KOE4jd-/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1jyBZbskm1DbnltEmYJ8tfBqtJZ_NCwqL/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '4-1', subject: 'MP&MC', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/1saKKF-BB9WlTuGITjVEEK8IkbF_nApkN/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1S7u0sPqQcGGt0603r812oI06FmJLe4IO/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1f-GCm8HzqjopqscCUocHIvV-80fDhw18/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1SpFiprq0h8RoxC-nSEpK6L9_GGahAapT/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1CWKD63q8t5quFYR7ND-0yQm1emcg0U0M/view?usp=drive_link' },
        ],
    },
    {
        regulation: 'R20', semester: '4-1', subject: 'Principles of Communication', department: 'AIML', year: 4,
        units: [
            { name: 'Unit 1', link: 'https://drive.google.com/file/d/178RIqONDq7QBH27waEHbly_PdNOPZ59k/view?usp=drive_link' },
            { name: 'Unit 2', link: 'https://drive.google.com/file/d/1c0rD1s7sNzIPyIBsJfZgi8Z4vaDKMUyo/view?usp=drive_link' },
            { name: 'Unit 3', link: 'https://drive.google.com/file/d/1YG7GkaAd_swJRczOeKnKZyY8Ru4n3MiN/view?usp=drive_link' },
            { name: 'Unit 4', link: 'https://drive.google.com/file/d/1WVzXUifbRowJBPpI568HeUJ1PSe5fRvq/view?usp=drive_link' },
            { name: 'Unit 5', link: 'https://drive.google.com/file/d/1udNUlPLBZljMB10jkuXYdw7semBd0gcG/view?usp=drive_link' },
        ],
    },
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database\n');

        let created = 0;
        let skipped = 0;
        let unitsCreated = 0;

        for (const mat of materials) {
            // Check for existing material with same regulation + semester + subject
            const existing = await Material.findOne({
                where: {
                    regulation: mat.regulation,
                    semester: mat.semester,
                    subject: mat.subject,
                },
            });

            if (existing) {
                console.log(`SKIP (exists): ${mat.regulation} ${mat.semester} — ${mat.subject}`);
                skipped++;
                continue;
            }

            const material = await Material.create({
                regulation: mat.regulation,
                semester: mat.semester,
                subject: mat.subject,
                department: mat.department || null,
                year: mat.year || null,
                syllabusLink: mat.syllabusLink || null,
            });

            if (mat.units && mat.units.length > 0) {
                await MaterialUnit.bulkCreate(
                    mat.units.map((u) => ({
                        materialId: material.id,
                        name: u.name,
                        link: u.link,
                    }))
                );
                unitsCreated += mat.units.length;
            }

            console.log(`CREATED: ${mat.regulation} ${mat.semester} — ${mat.subject} (${mat.units?.length || 0} units)`);
            created++;
        }

        console.log(`\n===== SEED COMPLETE =====`);
        console.log(`Created: ${created} materials, ${unitsCreated} units`);
        console.log(`Skipped: ${skipped} (already existed)`);
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
