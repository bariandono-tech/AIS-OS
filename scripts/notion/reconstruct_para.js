const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Database View IDs
const TASKS_DB_ID = '17f78c4c-e388-82e6-befb-01f49d5ebe82';
const NOTES_DB_ID = '38e78c4c-e388-82e4-a66e-818769620475';
const PROJECTS_DB_ID = '27778c4c-e388-8281-bb8c-014bab2582d7';
const AREAS_DB_ID = '0f378c4c-e388-8253-b33e-815844282c1a';

// Data Source IDs
const TASKS_DS_ID = '91d78c4c-e388-83f0-806c-87099cc6c471';
const NOTES_DS_ID = 'd6d78c4c-e388-83a3-9e0a-8746e586bf8a';
const PROJECTS_DS_ID = 'bdc78c4c-e388-83c7-9254-87b192111ae3';
const AREAS_DS_ID = '7be78c4c-e388-8228-9bcc-87b7d45a5578';

// Main callout block ID on the PARA page
const WELCOME_CALLOUT_BLOCK_ID = '86c78c4c-e388-8321-a4e0-01a9a574a957';

async function cleanDataSource(dataSourceId, label) {
  console.log(`\n🧹 Membersihkan Data Source: ${label} (${dataSourceId})...`);
  let count = 0;
  try {
    const response = await notion.dataSources.query({ data_source_id: dataSourceId });
    console.log(`Ditemukan ${response.results.length} item untuk dihapus.`);
    for (const page of response.results) {
      await notion.pages.update({
        page_id: page.id,
        archived: true
      });
      count++;
    }
    console.log(`✅ Berhasil mengarsipkan ${count} item dari ${label}.`);
  } catch (error) {
    console.error(`❌ Gagal membersihkan ${label}:`, error.message);
  }
}

async function createPageInDatabase(parentDbId, parentDsId, properties, children = []) {
  try {
    return await notion.pages.create({
      parent: { database_id: parentDbId },
      properties: properties,
      children: children
    });
  } catch (err) {
    console.log(`Peringatan: Gagal menggunakan database_id (${err.message}). Mencoba menggunakan data_source_id...`);
    return await notion.pages.create({
      parent: { 
        type: 'data_source_id',
        data_source_id: parentDsId 
      },
      properties: properties,
      children: children
    });
  }
}

async function runReconstruction() {
  console.log('=== MEMULAI REKONSTRUKSI PARA DASHBOARD ===');
  
  // TAHAP 1: Bersihkan semua dummy data lama
  await cleanDataSource(TASKS_DS_ID, 'Tasks [PARA]');
  await cleanDataSource(NOTES_DS_ID, 'Notes [PARA]');
  await cleanDataSource(PROJECTS_DS_ID, 'Projects [PARA]');
  await cleanDataSource(AREAS_DS_ID, 'Areas/Resources [PARA]');

  // TAHAP 2: Buat data baru (Areas / Resources)
  console.log('\n📂 Membuat data Areas & Resources...');
  const createdAreas = {};
  
  const areasData = [
    { name: 'Pendidikan & Akuntansi', type: 'Area', key: 'pendidikan' },
    { name: 'Metodologi Penelitian', type: 'Area', key: 'metpen' },
    { name: 'Buku & Jurnal Referensi', type: 'Resource', key: 'referensi' },
    { name: 'Aplikasi & Olah Data (SPSS)', type: 'Resource', key: 'spss' }
  ];

  for (const area of areasData) {
    const props = {
      'Name': {
        'title': [{ 'text': { 'content': area.name } }]
      },
      'Type': {
        'status': { 'name': area.type }
      }
    };
    try {
      const page = await createPageInDatabase(AREAS_DB_ID, AREAS_DS_ID, props);
      createdAreas[area.key] = page.id;
      console.log(`- Berhasil membuat ${area.type}: "${area.name}" (ID: ${page.id})`);
    } catch (e) {
      console.error(`Gagal membuat Area/Resource ${area.name}:`, e.message);
    }
  }

  // TAHAP 3: Buat data baru (Projects)
  console.log('\n📂 Membuat data Projects...');
  const createdProjects = {};

  const projectsData = [
    {
      name: 'Penyusunan Skripsi Akuntansi (SAK EMKM)',
      status: 'Doing',
      areaKey: 'pendidikan',
      key: 'skripsi'
    },
    {
      name: 'Persiapan Sidang & Ujian Komprehensif',
      status: 'Planned',
      areaKey: 'pendidikan',
      key: 'kompre'
    }
  ];

  for (const proj of projectsData) {
    const areaId = createdAreas[proj.areaKey];
    const props = {
      'Name': {
        'title': [{ 'text': { 'content': proj.name } }]
      },
      'Status': {
        'status': { 'name': proj.status }
      },
      'Area': areaId ? {
        'relation': [{ 'id': areaId }]
      } : undefined
    };
    try {
      const page = await createPageInDatabase(PROJECTS_DB_ID, PROJECTS_DS_ID, props);
      createdProjects[proj.key] = page.id;
      console.log(`- Berhasil membuat Project: "${proj.name}" (ID: ${page.id})`);
    } catch (e) {
      console.error(`Gagal membuat Project ${proj.name}:`, e.message);
    }
  }

  // TAHAP 4: Buat data baru (Tasks)
  console.log('\n📝 Membuat data Tasks...');
  
  const today = new Date().toISOString().split('T')[0];
  const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tasksData = [
    {
      name: 'Revisi Bab 1: Perjelas latar belakang & rumusan masalah',
      status: 'To Do',
      due: today,
      projKey: 'skripsi'
    },
    {
      name: 'Bimbingan Bab 2 dengan Dosen Pembimbing',
      status: 'Doing',
      due: in2Days,
      projKey: 'skripsi'
    },
    {
      name: 'Menyusun draf kuesioner penelitian Bab 3',
      status: 'To Do',
      due: in5Days,
      projKey: 'skripsi'
    },
    {
      name: 'Uji validitas & reliabilitas kuesioner dengan SPSS',
      status: 'To Do',
      due: null,
      projKey: 'skripsi'
    },
    {
      name: 'Review Jurnal Akuntansi Keuangan SAK EMKM terkini',
      status: 'Doing',
      due: null,
      projKey: 'skripsi'
    },
    {
      name: 'Fotokopi persyaratan administratif komprehensif',
      status: 'To Do',
      due: null,
      projKey: 'kompre'
    }
  ];

  for (const task of tasksData) {
    const projId = createdProjects[task.projKey];
    const props = {
      'Name': {
        'title': [{ 'text': { 'content': task.name } }]
      },
      'Status': {
        'status': { 'name': task.status }
      },
      'Due': task.due ? {
        'date': { 'start': task.due }
      } : undefined,
      'Project': projId ? {
        'relation': [{ 'id': projId }]
      } : undefined
    };
    try {
      const page = await createPageInDatabase(TASKS_DB_ID, TASKS_DS_ID, props);
      console.log(`- Berhasil membuat Task: "${task.name}" (ID: ${page.id})`);
    } catch (e) {
      console.error(`Gagal membuat Task ${task.name}:`, e.message);
    }
  }

  // TAHAP 5: Buat data baru (Notes) dengan child blocks
  console.log('\n📓 Membuat data Notes...');

  const notesData = [
    {
      name: 'Catatan Bimbingan Skripsi - Masukan Prof. Bambang',
      projKey: 'skripsi',
      areaKey: 'pendidikan',
      tags: ['Meeting'],
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Masukan Utama dari Prof. Bambang' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Fokus pada penerapan SAK EMKM untuk UMKM sektor manufaktur/kerajinan karena pencatatan persediaannya lebih kompleks.' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Jumlah sampel minimal 30 UMKM untuk memenuhi syarat statistik deskriptif.' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Tambahkan referensi jurnal internasional dari 5 tahun terakhir tentang kepatuhan standar akuntansi UMKM.' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Rencana Tindak Lanjut' } }]
          }
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Menyesuaikan latar belakang masalah dengan kompleksitas pencatatan persediaan' } }],
            checked: false
          }
        },
        {
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Membuat draf kuesioner awal berdasarkan indikator SAK EMKM' } }],
            checked: false
          }
        }
      ]
    },
    {
      name: 'Ringkasan Jurnal: Analisis Penerapan SAK EMKM',
      projKey: 'skripsi',
      areaKey: 'referensi',
      tags: ['Reference'],
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Detail Jurnal' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Jurnal ini membahas tentang implementasi SAK EMKM pada laporan keuangan pelaku usaha kecil. Masalah utama yang dihadapi adalah rendahnya pemahaman pemilik UMKM terhadap standar akuntansi resmi dan kurangnya pembukuan yang teratur.' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Metodologi & Temuan' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Metode penelitian menggunakan pendekatan kualitatif dengan wawancara mendalam.' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Temuan menunjukkan bahwa UMKM yang mendapatkan pembinaan dari dinas terkait cenderung lebih cepat menerapkan standar.' } }]
          }
        }
      ]
    },
    {
      name: 'Panduan Praktis Olah Data SPSS: Uji Validitas',
      projKey: 'skripsi',
      areaKey: 'spss',
      tags: ['Reference'],
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Langkah Uji Validitas di SPSS' } }]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Input data kuesioner dari Excel ke SPSS.' } }]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Pilih menu Analyze > Correlate > Bivariate.' } }]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Masukkan semua indikator variabel ke dalam kotak Variables.' } }]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Centang Pearson, Two-tailed, dan Flag significant correlations, lalu klik OK.' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Indikator dinyatakan valid jika r-hitung > r-tabel (pada tingkat signifikansi 5%).' } }]
          }
        }
      ]
    },
    {
      name: 'Draf Pertanyaan Wawancara Pemilik UMKM',
      projKey: 'skripsi',
      areaKey: 'metpen',
      tags: ['Journal'],
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Daftar Pertanyaan Wawancara' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Bagaimana cara Anda mencatat transaksi penjualan dan pembelian sehari-hari?' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Apakah Anda sudah memisahkan keuangan pribadi dengan keuangan usaha?' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Apa hambatan terbesar Anda dalam menyusun laporan keuangan bulanan?' } }]
          }
        }
      ]
    }
  ];

  for (const note of notesData) {
    const projId = createdProjects[note.projKey];
    const areaId = createdAreas[note.areaKey];
    
    const props = {
      'Name': {
        'title': [{ 'text': { 'content': note.name } }]
      },
      'Area/Resource': areaId ? {
        'relation': [{ 'id': areaId }]
      } : undefined,
      'Project': projId ? {
        'relation': [{ 'id': projId }]
      } : undefined,
      'Tags': {
        'multi_select': note.tags.map(t => ({ 'name': t }))
      }
    };
    
    try {
      const page = await createPageInDatabase(NOTES_DB_ID, NOTES_DS_ID, props, note.children);
      console.log(`- Berhasil membuat Note: "${note.name}" (ID: ${page.id})`);
    } catch (e) {
      console.error(`Gagal membuat Note ${note.name}:`, e.message);
    }
  }

  // TAHAP 6: Update Callout Welcome Banner di main PARA page
  console.log('\n📝 Memperbarui welcome callout banner di halaman utama PARA...');
  try {
    await notion.blocks.update({
      block_id: WELCOME_CALLOUT_BLOCK_ID,
      callout: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Dashboard Metode PARA untuk pengorganisasian skripsi dan tugas akhir jurusan Akuntansi. Mengorganisasikan Projects, Areas, Resources, dan Archives untuk penyusunan Tugas Akhir Anda.'
            }
          }
        ]
      }
    });
    console.log('✅ Berhasil memperbarui Callout welcome banner di halaman PARA!');
  } catch (error) {
    console.error('❌ Gagal memperbarui Callout welcome banner:', error.message);
  }

  console.log('\n=============================================');
  console.log('🎉 REKONSTRUKSI PARA DASHBOARD SELESAI!');
  console.log('=============================================');
}

runReconstruction();
