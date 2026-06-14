const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const ROOT_PAGE_ID = process.env.NOTION_PAGE_ID || '37b78c4ce38880fca6c9e71935752566';

async function buildHomepage() {
  console.log(`=== BUILDING HOMEPAGE FOR ROOT PAGE: ${ROOT_PAGE_ID} ===`);
  try {
    const blocks = [
      // 1. Header block
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '🧠 MAX Brain — Command Center\nSelamat datang di Command Center pribadi Anda. Gunakan shortcut di bawah ini untuk menangkap ide, mencatat tugas, dan menavigasi workspace.'
              }
            }
          ],
          icon: {
            type: 'emoji',
            emoji: '🧠'
          },
          color: 'blue_background'
        }
      },
      // 2. Divider
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      // 3. Quick Capture Heading
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '⚡ QUICK CAPTURE'
              }
            }
          ]
        }
      },
      // 4. Quick Capture Column List (3 Columns of buttons)
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: 'New Note',
                            link: {
                              url: 'https://app.notion.com/37b78c4ce38881de8816000bf8f8c872'
                            }
                          }
                        }
                      ],
                      icon: {
                        type: 'emoji',
                        emoji: '📝'
                      },
                      color: 'gray_background'
                    }
                  }
                ]
              }
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: 'New Task',
                            link: {
                              url: 'https://app.notion.com/37b78c4ce3888105a5b2000b5faa01a6'
                            }
                          }
                        }
                      ],
                      icon: {
                        type: 'emoji',
                        emoji: '✅'
                      },
                      color: 'gray_background'
                    }
                  }
                ]
              }
            },
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'callout',
                    callout: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: 'New Project',
                            link: {
                              url: 'https://app.notion.com/37b78c4ce38881f4836c000bebfc9b81'
                            }
                          }
                        }
                      ],
                      icon: {
                        type: 'emoji',
                        emoji: '🗂️'
                      },
                      color: 'gray_background'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      // 5. Divider
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      // 6. 3 Column Layout for Command Center
      {
        object: 'block',
        type: 'column_list',
        column_list: {
          children: [
            // Column 1: NOTES
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '📝 NOTES'
                          }
                        }
                      ]
                    }
                  },
                  {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '📥 Note Inbox\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-8157-87c4-cb60e48d3176'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '⭐ Favorites\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-816a-802d-c5c2258f59c3'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '🗂️ All Notes',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-810c-a33e-d394fe476c47'
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            // Column 2: TASKS
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '✅ TASKS'
                          }
                        }
                      ]
                    }
                  },
                  {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '📥 Task Inbox\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-8166-aa07-f671ecf09bd3'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '📅 Today\'s Tasks\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-8130-aaf6-ee8649e399e0'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '🗓️ Next 7 Days',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-81c1-b708-f98b2e4b941f'
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            // Column 3: PARA
            {
              object: 'block',
              type: 'column',
              column: {
                children: [
                  {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '🗂️ PARA'
                          }
                        }
                      ]
                    }
                  },
                  {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                      rich_text: [
                        {
                          type: 'text',
                          text: {
                            content: '🚧 Active Projects\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-813e-8b24-ffa36dbea8da'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '📂 Areas & Resources\n',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-816c-9350-e7ade82553f9'
                            }
                          }
                        },
                        {
                          type: 'text',
                          text: {
                            content: '⚡ PARA Dashboard',
                            link: {
                              url: 'https://app.notion.com/37b78c4c-e388-81d6-a855-df27060ac675'
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      // 7. Divider
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      // 8. Footer block
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '📌 Navigation: '
              },
              annotations: {
                bold: true
              }
            },
            {
              type: 'text',
              text: {
                content: 'Pro Notes',
                link: {
                  url: 'https://app.notion.com/p/37b78c4c-e388-8182-8b23-ddeb2116bea4'
                }
              }
            },
            {
              type: 'text',
              text: {
                content: '  |  '
              }
            },
            {
              type: 'text',
              text: {
                content: 'Pro Tasks',
                link: {
                  url: 'https://app.notion.com/p/37b78c4c-e388-8184-b1ab-ce02d9f593b8'
                }
              }
            },
            {
              type: 'text',
              text: {
                content: '  |  '
              }
            },
            {
              type: 'text',
              text: {
                content: 'PARA',
                link: {
                  url: 'https://app.notion.com/p/37b78c4c-e388-816c-9350-e7ade82553f9'
                }
              }
            },
            {
              type: 'text',
              text: {
                content: '  |  '
              }
            },
            {
              type: 'text',
              text: {
                content: 'PARA Dashboard',
                link: {
                  url: 'https://app.notion.com/p/37b78c4c-e388-81d6-a855-df27060ac675'
                }
              }
            }
          ],
          icon: {
            type: 'emoji',
            emoji: '📌'
          },
          color: 'gray_background'
        }
      }
    ];

    console.log('Appending blocks to ROOT PAGE...');
    const response = await notion.blocks.children.append({
      block_id: ROOT_PAGE_ID,
      children: blocks
    });
    console.log('✅ Successfully created homepage Command Center!');
  } catch (error) {
    console.error('❌ Failed to create homepage:', error.message);
  }
}

buildHomepage();
