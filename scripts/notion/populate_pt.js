const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Database View IDs for PT
const TASKS_DB_ID = '67f78c4c-e388-821f-9263-81d511dcb2f2';
const NOTES_DB_ID = '8a378c4c-e388-830b-8154-017b0a0c96f7';
const PROJECTS_DB_ID = '3fb78c4c-e388-8219-9430-01612e494abc';
const AREAS_DB_ID = 'bf978c4c-e388-822b-adba-017759df1259';

// Data Source IDs for PT
const TASKS_DS_ID = 'd3078c4c-e388-82ba-b06e-87afad95803d';
const NOTES_DS_ID = 'a2b78c4c-e388-82df-a6b2-079f51483cc1';
const PROJECTS_DS_ID = '45078c4c-e388-83e2-aad8-07f4d8067fb9';
const AREAS_DS_ID = '69978c4c-e388-8338-90a8-07d890c07aad';

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
  console.log('=== MEMULAI POPULASI DATA UNTUK MAIN PARA PAGE (PT) ===');
  
  // TAHAP 1: Bersihkan semua dummy data lama (jika ada)
  await cleanDataSource(TASKS_DS_ID, 'Tasks [PT]');
  await cleanDataSource(NOTES_DS_ID, 'Notes [PT]');
  await cleanDataSource(PROJECTS_DS_ID, 'Projects [PT]');
  await cleanDataSource(AREAS_DS_ID, 'Areas/Resources [PT]');

  // TAHAP 2: Buat data baru (Areas / Resources)
  console.log('\n📂 Membuat data Areas & Resources [PT]...');
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
  console.log('\n📂 Membuat data Projects [PT]...');
  const createdProjects = {};

  const projectsData = [
    {
      name: 'Penyusunan Skripsi Akuntansi (SAK EMKM)',
      status: 'In progress', // Sesuai schema PT (options: Not started, In progress, Done)
      areaKey: 'pendidikan',
      key: 'skripsi'
    },
    {
      name: 'Persiapan Sidang & Ujian Komprehensif',
      status: 'Not started', // Sesuai schema PT
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
  console.log('\n📝 Membuat data Tasks [PT]...');
  
  const today = new Date().toISOString().split('T')[0];
  const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tasksData = [
    {
      name: 'Revisi Bab 1: Perjelas latar belakang & rumusan masalah',
      status: 'Not started', // Sesuai schema Done: Not started, In progress, Done
      due: today,
      projKey: 'skripsi'
    },
    {
      name: 'Bimbingan Bab 2 dengan Dosen Pembimbing',
      status: 'In progress',
      due: in2Days,
      projKey: 'skripsi'
    },
    {
      name: 'Menyusun draf kuesioner penelitian Bab 3',
      status: 'Not started',
      due: in5Days,
      projKey: 'skripsi'
    },
    {
      name: 'Uji validitas & reliabilitas kuesioner dengan SPSS',
      status: 'Not started',
      due: null,
      projKey: 'skripsi'
    },
    {
      name: 'Review Jurnal Akuntansi Keuangan SAK EMKM terkini',
      status: 'In progress',
      due: null,
      projKey: 'skripsi'
    },
    {
      name: 'Fotokopi persyaratan administratif komprehensif',
      status: 'Not started',
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
      'Done': { // Properti status pada Tasks [PT] bernama 'Done'
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
  console.log('\n📓 Membuat data Notes [PT]...');

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

  console.log('\n=============================================');
  console.log('🎉 REKONSTRUKSI MAIN PARA PAGE (PT) SELESAI!');
  console.log('=============================================');
}

runReconstruction();
