import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collegeconnect.com' },
    update: {},
    create: {
      email: 'admin@collegeconnect.com',
      password: adminPassword,
      role: 'PLATFORM_ADMIN',
      profile: {
        create: {
          fullName: 'System Administrator',
          isOnboarded: true,
          onboardingStep: 5,
          bio: 'I am the system administrator.',
        },
      },
    },
  });

  console.log({ admin });

  const colleges = [
    // National Institutes
    { name: 'National Institute of Technology Calicut', slug: 'nitc', city: 'Kozhikode', state: 'Kerala' },
    { name: 'ER&DCI Institute of Technology, Trivandrum', slug: 'erdci', city: 'Trivandrum', state: 'Kerala' },
    { name: 'National Institute of Electronics & Information Technology, Calicut', slug: 'nielit', city: 'Kozhikode', state: 'Kerala' },
    { name: 'Indian Institute of Space Science and Technology, Trivandrum', slug: 'iist', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Indian Institute of Information Technology Kottayam', slug: 'iiitk', city: 'Kottayam', state: 'Kerala' },
    { name: 'Indian Institute of Technology Palakkad', slug: 'iit-pkd', city: 'Palakkad', state: 'Kerala' },
    { name: 'Indian Institute of Science Education and Research, Thiruvananthapuram', slug: 'iiser-tvm', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Sree Chitra Tirunal Institute for Medical Sciences and Technology', slug: 'sctimst', city: 'Trivandrum', state: 'Kerala' },

    // State Government Engineering Colleges
    { name: 'College of Engineering, Trivandrum', slug: 'cet', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Government Engineering College, Thrissur', slug: 'gect', city: 'Thrissur', state: 'Kerala' },
    { name: 'Thangal Kunju Musaliar College of Engineering', slug: 'tkmce', city: 'Kollam', state: 'Kerala' },
    { name: 'NSS College of Engineering', slug: 'nssce', city: 'Palakkad', state: 'Kerala' },
    { name: 'Mar Athanasius College of Engineering', slug: 'mace', city: 'Kothamangalam', state: 'Kerala' },
    { name: 'Government College of Engineering, Kannur', slug: 'gcek', city: 'Kannur', state: 'Kerala' },
    { name: 'Rajiv Gandhi Institute of Technology', slug: 'rit', city: 'Kottayam', state: 'Kerala' },
    { name: 'Government Engineering College, Sreekrishnapuram', slug: 'gecskp', city: 'Palakkad', state: 'Kerala' },
    { name: 'Government Engineering College, Trivandrum (Barton Hill)', slug: 'gecb', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Government Engineering College, Kozhikode', slug: 'geck', city: 'Kozhikode', state: 'Kerala' },
    { name: 'Government Engineering College, Wayanad', slug: 'gecw', city: 'Wayanad', state: 'Kerala' },
    { name: 'Government Engineering College, Idukki', slug: 'geci', city: 'Idukki', state: 'Kerala' },

    // Government Departments
    { name: 'Government Model Engineering College', slug: 'mec', city: 'Ernakulam', state: 'Kerala' },
    { name: 'College of Engineering Chengannur', slug: 'cec', city: 'Chengannur', state: 'Kerala' },
    { name: 'L.B.S College of Engineering', slug: 'lbsce', city: 'Kasaragod', state: 'Kerala' },
    { name: 'L B S Institute of Technology for Women', slug: 'lbsitw', city: 'Trivandrum', state: 'Kerala' },
    { name: 'College of Engineering Attingal', slug: 'ceal', city: 'Attingal', state: 'Kerala' },
    { name: 'College of Engineering, Cherthala', slug: 'cectl', city: 'Cherthala', state: 'Kerala' },
    { name: 'College of Engineering, Kallooppara', slug: 'cekpr', city: 'Kallooppara', state: 'Kerala' },
    { name: 'College of Engineering, Karunagappally', slug: 'cek', city: 'Karunagappally', state: 'Kerala' },
    { name: 'College of Engineering, Kottarakkara', slug: 'cekra', city: 'Kottarakkara', state: 'Kerala' },
    { name: 'College of Engineering, Poonjar', slug: 'cep', city: 'Poonjar', state: 'Kerala' },
    { name: 'College of Engineering, Aranmula', slug: 'aec', city: 'Aranmula', state: 'Kerala' },
    { name: 'College of Engineering, Kidangoor', slug: 'cekgr', city: 'Kidangoor', state: 'Kerala' },
    { name: 'College of Engineering & Management, Punnapra', slug: 'cemp', city: 'Punnapra', state: 'Kerala' },
    { name: 'College of Engineering, Pathanapuram', slug: 'pec', city: 'Pathanapuram', state: 'Kerala' },
    { name: 'College of Engineering, Perumon', slug: 'prn', city: 'Perumon', state: 'Kerala' },
    { name: 'College of Engineering, Thalassery', slug: 'tly', city: 'Thalassery', state: 'Kerala' },
    { name: 'College of Engineering, Thrikaripur', slug: 'tkr', city: 'Trikaripur', state: 'Kerala' },
    { name: 'College of Engineering, Vatakara', slug: 'cev', city: 'Vatakara', state: 'Kerala' },
    { name: 'College of Engineering Muttathara', slug: 'cem', city: 'Muttathara', state: 'Kerala' },
    { name: 'College of Engineering Munnar', slug: 'mnr', city: 'Munnar', state: 'Kerala' },
    { name: 'College of Engineering, Adoor', slug: 'cea', city: 'Adoor', state: 'Kerala' },
    { name: 'Sree Chitra Thirunal College of Engineering', slug: 'sctce', city: 'Trivandrum', state: 'Kerala' },

    // Universities
    { name: 'School of Engineering, CUSAT', slug: 'cusat', city: 'Kochi', state: 'Kerala' },
    { name: 'Cochin University College of Engineering Kuttanad', slug: 'cucek', city: 'Alappuzha', state: 'Kerala' },
    { name: 'Calicut University Institute of Engineering & Technology', slug: 'cuiet', city: 'Tenhipalam', state: 'Kerala' },
    { name: 'University College of Engineering, Kariavattom', slug: 'ucek', city: 'Trivandrum', state: 'Kerala' },
    { name: 'University College of Engineering, Thodupuzha', slug: 'uce', city: 'Thodupuzha', state: 'Kerala' },
    { name: 'Kelappaji College of Agricultural Engineering and Technology', slug: 'kcaet', city: 'Tavanur', state: 'Kerala' },

    // Private Self-Financing
    { name: 'ACE College of Engineering', slug: 'ace', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Adi Shankara Institute of Engineering Technology', slug: 'asi', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Ahalia School of Engineering and Technology', slug: 'atp', city: 'Palakkad', state: 'Kerala' },
    { name: 'Al Azhar College of Engineering and Technology', slug: 'aae', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Al-Ameen Engineering College', slug: 'aap', city: 'Palakkad', state: 'Kerala' },
    { name: 'Albertian Institute of Science and Technology', slug: 'aik', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Amal Jyothi College of Engineering', slug: 'ajc', city: 'Kottayam', state: 'Kerala' },
    { name: 'Ammini College of Engineering', slug: 'ame', city: 'Palakkad', state: 'Kerala' },
    { name: 'AWH Engineering College', slug: 'awh', city: 'Kozhikode', state: 'Kerala' },
    { name: 'Axis College of Engineering and Technology', slug: 'axe', city: 'Thrissur', state: 'Kerala' },
    { name: 'Baselios Mathews II College of Engineering', slug: 'bmc', city: 'Kollam', state: 'Kerala' },
    { name: 'Baselios Thomas I Catholicose College of Engineering', slug: 'bte', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Believers Church Caarmel Engineering College', slug: 'cml', city: 'Pathanamthitta', state: 'Kerala' },
    { name: 'Bishop Jerome Institute', slug: 'bjk', city: 'Kollam', state: 'Kerala' },
    { name: 'Carmel College of Engineering and Technology', slug: 'cma', city: 'Alappuzha', state: 'Kerala' },
    { name: 'Christ College of Engineering', slug: 'cce', city: 'Thrissur', state: 'Kerala' },
    { name: 'Christ Knowledge City', slug: 'ckc', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Cochin College of Engineering and Technology', slug: 'ccv', city: 'Malappuram', state: 'Kerala' },
    { name: 'Cochin Institute of Science and Technology', slug: 'cim', city: 'Ernakulam', state: 'Kerala' },
    { name: 'College of Engineering and Technology, Payyanur', slug: 'cen', city: 'Kannur', state: 'Kerala' },
    { name: 'Eranad Knowledge City Technical Campus', slug: 'ekc', city: 'Malappuram', state: 'Kerala' },
    { name: 'Federal Institute of Science and Technology', slug: 'fit', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Gurudeva Institute of Science And Technology', slug: 'git', city: 'Kottayam', state: 'Kerala' },
    { name: 'Heera College of Engineering and Technology', slug: 'hce', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Holy Grace Academy of Engineering', slug: 'hgw', city: 'Thrissur', state: 'Kerala' },
    { name: 'MGM College of Engineering & Technology', slug: 'hkc', city: 'Ernakulam', state: 'Kerala' },
    { name: 'IES College of Engineering', slug: 'ies', city: 'Thrissur', state: 'Kerala' },
    { name: 'Ilahia College of Engineering Technology', slug: 'ice', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Ilahia School of Science and Technology', slug: 'ict', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Indira Gandhi Institute of Engineering and Technology For Women', slug: 'igw', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Jai Bharath College of Management and Engineering Technology', slug: 'jbt', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Jawaharlal College of Engineering and Technology', slug: 'jce', city: 'Palakkad', state: 'Kerala' },
    { name: 'John Cox Memorial C S I Institute of Technology', slug: 'jit', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Jyothi Engineering College', slug: 'jec', city: 'Thrissur', state: 'Kerala' },
    { name: 'K M E A Engineering College', slug: 'kme', city: 'Ernakulam', state: 'Kerala' },
    { name: 'KMCT College of Engineering', slug: 'kmc', city: 'Kozhikode', state: 'Kerala' },
    { name: 'KMCT College of Engineering For Women', slug: 'kmw', city: 'Kozhikode', state: 'Kerala' },
    { name: 'Kottayam Institute of Technology and Science', slug: 'kit', city: 'Kottayam', state: 'Kerala' },
    { name: 'Lourdes Matha College of Science and Technology', slug: 'lmc', city: 'Trivandrum', state: 'Kerala' },
    { name: 'MEA Engineering College', slug: 'mea', city: 'Malappuram', state: 'Kerala' },
    { name: 'MES College of Engineering', slug: 'mes', city: 'Malappuram', state: 'Kerala' },
    { name: 'M G College of Engineering', slug: 'mgc', city: 'Trivandrum', state: 'Kerala' },
    { name: 'M. Dasan Institute of Technology', slug: 'dmc', city: 'Kozhikode', state: 'Kerala' },
    { name: 'Malabar College of Engineering and Technology', slug: 'mcet-malabar', city: 'Thrissur', state: 'Kerala' },
    { name: 'Malabar Institute of Technology', slug: 'mlt', city: 'Kannur', state: 'Kerala' },
    { name: 'Mangalam College of Engineering', slug: 'mlm', city: 'Kottayam', state: 'Kerala' },
    { name: 'Mar Baselios Christian College of Engineering and Technology', slug: 'mbc', city: 'Idukki', state: 'Kerala' },
    { name: 'Mar Baselios College of Engineering and Technology', slug: 'mbt', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Mar Baselios Institute of Technology and Science', slug: 'mbi', city: 'Ernakulam', state: 'Kerala' },
    { name: 'MES College of Engineering and Technology', slug: 'mee', city: 'Ernakulam', state: 'Kerala' },
    { name: 'MES Institute of Technology and Management', slug: 'mek', city: 'Kollam', state: 'Kerala' },
    { name: 'MET\'S School of Engineering', slug: 'met', city: 'Thrissur', state: 'Kerala' },
    { name: 'Mohandas College of Engineering and Technology', slug: 'mct', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Mount Zion College of Engineering', slug: 'mzc', city: 'Pathanamthitta', state: 'Kerala' },
    { name: 'Mount Zion College of Engineering For Women', slug: 'mzw', city: 'Alappuzha', state: 'Kerala' },
    { name: 'Musaliar College of Engineering', slug: 'mcc', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Musaliar College of Engineering and Technology', slug: 'mck', city: 'Pathanamthitta', state: 'Kerala' },
    { name: 'Muslim Association College of Engineering', slug: 'mus', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Muthoot Institute of Technology and Science', slug: 'mut', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Nehru College of Engineering and Research Centre', slug: 'nce', city: 'Thrissur', state: 'Kerala' },
    { name: 'Nirmala College of Engineering', slug: 'nie', city: 'Thrissur', state: 'Kerala' },
    { name: 'Providence College of Engineering', slug: 'prc', city: 'Alappuzha', state: 'Kerala' },
    { name: 'Rajadhani Institute of Engineering and Technology', slug: 'rie', city: 'Trivandrum', state: 'Kerala' },
    { name: 'Rajagiri School of Engineering and Technology', slug: 'ret', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Royal College of Engineering and Technology', slug: 'rce', city: 'Thrissur', state: 'Kerala' },
    { name: 'Sahrdaya College of Engineering and Technology', slug: 'shr', city: 'Thrissur', state: 'Kerala' },
    { name: 'Saintgits College of Engineering', slug: 'mgp', city: 'Kottayam', state: 'Kerala' },
    { name: 'Sarabhai Institute of Science and Technology', slug: 'sit', city: 'Trivandrum', state: 'Kerala' },
    { name: 'SCMS School of Engineering and Technology', slug: 'scm', city: 'Ernakulam', state: 'Kerala' },
    { name: 'SNM Institute of Management and Technology', slug: 'snm', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Sree Buddha College of Engineering', slug: 'sbc', city: 'Alappuzha', state: 'Kerala' },
    { name: 'Sree Buddha College of Engineering For Women', slug: 'sbw', city: 'Pathanamthitta', state: 'Kerala' },
    { name: 'Sree Narayana Guru College of Engineering and Technology', slug: 'snc', city: 'Kannur', state: 'Kerala' },
    { name: 'Sree Narayana Guru Institute of Science and Technology', slug: 'snt', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Sree Narayana Gurukulam College of Engineering', slug: 'sng', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Sree Narayana Institute of Technology', slug: 'snp', city: 'Pathanamthitta', state: 'Kerala' },
    { name: 'Sreepathy Institute of Management and Technology', slug: 'spt', city: 'Palakkad', state: 'Kerala' },
    { name: 'Sri Vellappally Natesan College of Engineering', slug: 'vpe', city: 'Alappuzha', state: 'Kerala' },
    { name: 'St. Joseph\'s College of Engineering and Technology', slug: 'sjc', city: 'Kottayam', state: 'Kerala' },
    { name: 'St. Thomas College of Engineering and Technology, Sivapuram', slug: 'stm', city: 'Kannur', state: 'Kerala' },
    { name: 'St. Thomas College of Engineering and Technology, Chengannur', slug: 'stc', city: 'Alappuzha', state: 'Kerala' },
    { name: 'St.Thomas Institute for Science and Technology', slug: 'sti', city: 'Trivandrum', state: 'Kerala' },
    { name: 'TKM Institute of Technology', slug: 'tki', city: 'Kollam', state: 'Kerala' },
    { name: 'Thejus Engineering College', slug: 'tje', city: 'Thrissur', state: 'Kerala' },
    { name: 'Toc H Institute of Science and Technology', slug: 'toc', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Toms College of Engineering For Startups', slug: 'tce', city: 'Kottayam', state: 'Kerala' },
    { name: 'Trinity College of Engineering', slug: 'tct', city: 'Thiruvananthapuram', state: 'Kerala' },
    { name: 'UKF College of Engineering and Technology', slug: 'ukp', city: 'Kollam', state: 'Kerala' },
    { name: 'Universal Engineering College', slug: 'unt', city: 'Thrissur', state: 'Kerala' },
    { name: 'Valia Koonambaikulathamma College of Engineering and Technology', slug: 'vke', city: 'Kollam', state: 'Kerala' },
    { name: 'Vedavyasa Institute of Technology', slug: 'vvt', city: 'Malappuram', state: 'Kerala' },
    { name: 'Vidya Academy of Science and Technology', slug: 'vas', city: 'Thrissur', state: 'Kerala' },
    { name: 'Vidya Academy of Science and Technology Technical Campus', slug: 'vak', city: 'Thiruvananthapuram', state: 'Kerala' },
    { name: 'VISAT Engineering College', slug: 'vit', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Vimal Jyothi Engineering College', slug: 'vml', city: 'Kannur', state: 'Kerala' },
    { name: 'Viswajyothi College of Engineering and Technology', slug: 'vjc', city: 'Ernakulam', state: 'Kerala' },
    { name: 'Younus College of Engineering', slug: 'ycw', city: 'Kollam', state: 'Kerala' },
  ];

  for (const college of colleges) {
    const c = await prisma.college.upsert({
      where: { slug: college.slug },
      update: {},
      create: college,
    });
    console.log(`Seeded college: ${c.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });